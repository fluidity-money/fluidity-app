// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"os"
	"strconv"
	"sync"

	"github.com/fluidity-money/fluidity-app/cmd/connector-solana-amqp/lib/queue"
	"github.com/fluidity-money/fluidity-app/common/solana"
	solanaRpc "github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"

	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/cmd/connector-solana-amqp/lib/redis"
)

const (
	// RedisGlobalSentBlocks for the buffer of blocks sent
	RedisGlobalSentBlocks = `solana.sent-blocks.global`

	// RedisOwnSentBlocks for the prefix of blocks seen by a given websocket,
	// to be appended with .<token>
	RedisOwnSentBlocks = `solana.sent-blocks`

	// BlockPageLength is the number of confirmed blocks to fetch at once
	BlockPageLength = 1000

	// RedisBufferSize is the length of the buffer for previously seen blocks
	// A hanging websocket can duplicate blocks if this buffer is overwritten
	// before it crashes and restarts the program
	RedisBufferSize = 100
)

const (
	// EnvTokensList to relate the received token names to a contract address
	EnvTokensList = "FLU_SOLANA_TOKENS_LIST"

	// EnvSolanaWsUrl is the URL to connect to the Solana websocket api
	EnvSolanaWsUrl = `FLU_SOLANA_WS_URL`

	// EnvSolanaRpcUrl is the URL to make solana RPC calls to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvStartingSlot is the slot to start from if the Redis key is not set
	EnvStartingSlot = `FLU_SOLANA_STARTING_SLOT`
)

// updateConfirmedBlocksFrom to process all slots from `from`, as there is no
// equivalent to blockSubscribe for past events
func updateConfirmedBlocksFrom(client *solanaRpc.Provider, from uint64) (uint64, error) {
	var lastBlock uint64 = 0

	for {
		blocks, err := client.GetConfirmedBlocks(from, BlockPageLength)

		if err != nil {
			return 0, fmt.Errorf("Failed to get confirmed blocks! %w", err)
		}

		log.Debug(func(k *log.Log) {
			k.Format("Got confirmed blocks from solana! %+v", blocks)
		})

		processSlots(blocks)

		if len(blocks) == 0 {
			// we're fetching past the end
			log.Debug(func(k *log.Log) {
				k.Format("Trying to fetch block %d past the end", from)
			})

			return lastBlock, nil
		}

		lastBlock = blocks[len(blocks)-1]

		if len(blocks) != BlockPageLength {
			// we've fetched everything
			log.Debug(func(k *log.Log) {
				k.Format("Done fetching up to block %d", lastBlock)
			})

			return lastBlock, nil
		}

		// keep fetching from the last slot we just saw
		from = lastBlock + 1

		log.Debug(func(k *log.Log) {
			k.Format("Continuing fetch from block %d", from)
		})
	}
}

func main() {
	var (
		solanaWsUrl      = util.PickEnvOrFatal(EnvSolanaWsUrl)
		solanaRpcUrl     = util.PickEnvOrFatal(EnvSolanaRpcUrl)
		solanaTokenList_ = util.GetEnvOrFatal(EnvTokensList)
	)

	var (
		startingBlock    uint64
		startingBlockEnv = os.Getenv(EnvStartingSlot)
	)

	tokenList := solana.GetTokensListSolana(solanaTokenList_)

	solanaHttp, err := solanaRpc.New(solanaRpcUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the HTTP client!"
			k.Payload = err
		})
	}

	solanaWebsocket, err := solanaRpc.NewWebsocket(solanaWsUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the websocket client!"
			k.Payload = err
		})
	}
	switch startingBlockEnv {
	// immediately subscribe to latest blocks
	case "latest":
	// default to the lowest slot saved in Redis
	case "":
		for _, token := range tokenList {
			tokenRedisKey := RedisOwnSentBlocks + "." + token.TokenName
			lastBlock := redis.GetLastBlock(tokenRedisKey)

			// choose the lowest block of any token
			shouldBeLatestBlock := startingBlock == 0 || startingBlock > lastBlock

			if shouldBeLatestBlock {
				startingBlock = lastBlock
			}
		}

	// otherwise use env
	default:
		startingBlock, err = strconv.ParseUint(startingBlockEnv, 10, 64)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to parse starting slot from env!"
				k.Payload = err
			})
		}

		startingBlock = startingBlock - 1
	}

	if startingBlock != 0 {
		log.Debug(func(k *log.Log) {
			k.Message = "Starting block not 0, updating!"
			k.Payload = startingBlock
		})
		updateConfirmedBlocksFrom(solanaHttp, startingBlock)
	}

	// use a neverending WaitGroup to avoid exiting immediately
	var wg sync.WaitGroup

	// create a websocket per token, as blockSubscribe only supports one address
	for _, token := range tokenList {
		tokenRedisKey := RedisOwnSentBlocks + "." + token.TokenName
		wg.Add(1)
		defer wg.Done()

		go solanaWebsocket.SubscribeBlocks(token.FluidMintPubkey, func(b solanaRpc.BlockResponse) {
			processSlot(tokenRedisKey, b.Value.Slot)
		})
	}

	wg.Wait()
}

// processSlot to write a block to the queue if it hasn't been already
func processSlot(redisKey string, slot uint64) {
	// if redisKey is set, caller is a websocket listener
	if redisKey != "" {
		redis.WriteLastBlock(redisKey, slot)
	}

	slotStr := strconv.Itoa(int(slot))

	if state.ZExists(RedisGlobalSentBlocks, slotStr) {
		log.Debug(func(k *log.Log) {
			k.Message = "Slot already found, skipping!"
			k.Payload = slot
		})
		return
	}

	log.Debug(func(k *log.Log) {
		k.Message = "Slot doesn't exist globally, processing!"
		k.Payload = slot
	})

	// add slot number with score as its own value
	state.ZAddSelfScore(RedisGlobalSentBlocks, float64(slot))

	// cap at RedisBufferSize values
	state.ZRemRangeByRank(RedisGlobalSentBlocks, 0, -(RedisBufferSize + 1))

	queue.SendConfirmedBlocks([]uint64{slot})
}

// processSlots to process an array of slots
func processSlots(slots []uint64) {
	for _, slot := range slots {
		processSlot("", slot)
	}
}
