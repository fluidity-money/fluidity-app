// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	ethRpc "github.com/ethereum/go-ethereum/rpc"

	commonEth "github.com/fluidity-money/fluidity-app/common/ethereum"
	addresslinker "github.com/fluidity-money/fluidity-app/common/ethereum/address-linker"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	queueEth "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// RedisBlockKey to use to find the latest block that was seen
	// by the logs microservice
	RedisBlockKey = `ethereum.logs.latest-block`

	// EnvEthereumWsUrl to use to find the geth websocket to use
	// for live blocks
	EnvEthereumWsUrl = `FLU_ETHEREUM_WS_URL`

	// EnvStartingBlock to begin from if the Redis key is not set
	EnvStartingBlock = `FLU_ETHEREUM_START_BLOCK`

	// EnvTokenList to get the list of tokens to watch events from
	EnvTokenList = `FLU_ETHEREUM_TOKENS_LIST`

	// EnvPaginationAmount to change the pagination length
	EnvPaginationAmount = `FLU_ETHEREUM_LOG_PAGINATION_AMOUNT`

	// TopicLogs to use when writing logs found with Ethereum
	TopicLogs = queueEth.TopicLogs
)

func getLatestBlockHeight(client *ethclient.Client) (uint64, error) {
	currentBlockHeight, err := client.BlockNumber(
		context.Background(),
	)

	if err != nil {
		return 0, fmt.Errorf(
			"Failed to get the current block! %v",
			err,
		)
	}

	return currentBlockHeight, nil
}

// paginateLogs by calling FilterLogs until the client is brought back up
// to the latest log
func paginateLogs(tokens []common.Address, topics [][]common.Hash, client *ethclient.Client, fromBlockHeight, paginateAmount uint64, chanLogs chan ethTypes.Log) (uint64, error) {
	currentBlockHeight, err := getLatestBlockHeight(client)

	if err != nil {
		return 0, err
	}

	nextBlockHeight := fromBlockHeight + paginateAmount

	filterQuery := ethereum.FilterQuery{
		FromBlock: newBig(fromBlockHeight),
		ToBlock:   newBig(nextBlockHeight),
		Addresses: tokens,
		Topics:    topics,
	}

	log.Debug(func(k *log.Log) {
		k.Format(
			"Paginating from %v to %v, max block is %v",
			fromBlockHeight,
			nextBlockHeight,
			currentBlockHeight,
		)
	})

	logsResponse, err := client.FilterLogs(
		context.Background(),
		filterQuery,
	)

	if err != nil {
		return 0, fmt.Errorf(
			"Can't get a filter from range %v to range %v, current %v! %v",
			fromBlockHeight,
			nextBlockHeight,
			currentBlockHeight+1,
			err,
		)
	}

	for _, ethLog := range logsResponse {
		// hardhat sends blocks that are outside the range that we specify, so we
		// ignore outliers like this

		if blockNumber := ethLog.BlockNumber; blockNumber < fromBlockHeight {
			log.Debugf(
				"Block below the current pagination item of %v was found, ignoring!",
				blockNumber,
			)

			continue
		}

		chanLogs <- ethLog
	}

	if nextBlockHeight < currentBlockHeight {
		return paginateLogs(
			tokens,
			topics,
			client,
			nextBlockHeight+1,
			paginateAmount,
			chanLogs,
		)
	}

	return nextBlockHeight, nil
}

func main() {
	var (
		ethereumWsUrl     = util.PickEnvOrFatal(EnvEthereumWsUrl)
		tokenList_        = util.GetEnvOrFatal(EnvTokenList)
		paginationAmount_ = util.GetEnvOrFatal(EnvPaginationAmount)
	)

	tokenList := util.GetTokensListBase(tokenList_)

	tokens := make([]common.Address, len(tokenList))

	for i, token := range tokenList {
		tokens[i] = common.HexToAddress(token.TokenAddress)
	}

	paginationAmount, err := strconv.ParseUint(paginationAmount_, 10, 64)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse pagination amount from env!"
			k.Payload = err
		})
	}

	topics := [][]common.Hash{
		{
			fluidity.FluidityContractAbi.Events["Reward"].ID,
			fluidity.FluidityContractAbi.Events["BlockedReward"].ID,
			fluidity.FluidityContractAbi.Events["UnblockReward"].ID,
			fluidity.FluidityContractAbi.Events["Transfer"].ID,
			fluidity.FluidityContractAbi.Events["MintFluid"].ID,
			fluidity.FluidityContractAbi.Events["BurnFluid"].ID,
			fluidity.StakingAbi.Events["Deposited"].ID,
			addresslinker.AddressConfirmerAbi.Events["AddressConfirmed"].ID,
		},
	}

	rpcClient, err := ethRpc.Dial(ethereumWsUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to the Geth WS!"
			k.Payload = err
		})
	}

	gethClient := ethclient.NewClient(rpcClient)

	var (
		startingBlock    uint64
		startingBlockEnv = os.Getenv(EnvStartingBlock)
	)

	switch startingBlockEnv {
	case "latest":
		startingBlock, err = getLatestBlockHeight(gethClient)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get the latest block height!"
				k.Payload = err
			})
		}

	case "":
		// if this isn't set, then we start from the block following the last
		// block that we saw

		startingBlock = redisGetLastBlock() + 1

		log.Debug(func(k *log.Log) {
			currentBlockHeight, _ := getLatestBlockHeight(gethClient)

			k.Format(
				"Starting to filter using Redis, Redis reported block %v! Starting from %d! Max is %v",
				startingBlock-1,
				startingBlock,
				currentBlockHeight,
			)
		})

	default:
		startingBlock, err = strconv.ParseUint(startingBlockEnv, 10, 64)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get the starting block from an env!"
				k.Payload = err
			})
		}
	}

	log.App(func(k *log.Log) {
		k.Format(
			"About to filter for logs in blocks starting from %v until %v!",
			startingBlock,
			startingBlock+paginationAmount,
		)
	})

	chanGethLogs := make(chan ethTypes.Log)

	go func() {
		currentBlockHeight, err := paginateLogs(
			tokens,
			topics,
			gethClient,
			startingBlock,
			paginationAmount,
			chanGethLogs,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to paginate logs!"
				k.Payload = err
			})
		}

		log.Debug(func(k *log.Log) {
			latestBlockHeight, err := getLatestBlockHeight(gethClient)

			if err != nil {
				panic(err)
			}

			k.Format(
				"Done paginating! At block height %v! Current max %v!",
				currentBlockHeight,
				latestBlockHeight,
			)
		})

		logsFilter := map[string]interface{}{
			"address": tokens,
			"topics":  topics,
		}

		logsFilterJson, err := json.Marshal(logsFilter)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to marshal the filter query to json!"
				k.Payload = err
			})
		}

		log.Debug(func(k *log.Log) {
			k.Format(
				"Filtering for logs with filter: %s",
				logsFilterJson,
			)
		})

		subscription, err := rpcClient.EthSubscribe(
			context.Background(),
			chanGethLogs,
			"logs",
			logsFilter,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to filter for Geth logs!"
				k.Payload = err
			})
		}

		for err := range subscription.Err() {
			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Subscription failed with an error!"
					k.Payload = err
				})
			}
		}
	}()

	var (
		lastBlockSeen uint64 = 0

		logsSeen = make(map[uint]bool)

		lastBlockEmitted uint64
	)

	thirtyMinuteTimer := time.After(30 * time.Minute)

	for {
		log.Debugf("Waiting for new messages from Geth!")

		select {
		case <-thirtyMinuteTimer:
			log.Fatal(func(k *log.Log) {
				k.Message = "30 minute kill timer reached"
			})

		case gethLog := <-chanGethLogs:

			var (
				blockNumber = gethLog.BlockNumber
				logIndex    = gethLog.Index
				isRemoved   = gethLog.Removed
			)

			log.Debugf(
				"Received a log at block number %v log index %d!",
				blockNumber,
				logIndex,
			)

			if isRemoved {
				log.Debugf(
					"Log at block number %#v was removed!",
					blockNumber,
				)

				continue
			}

			if lastBlockEmitted != blockNumber {
				lastBlockEmitted = blockNumber
				logsSeen = make(map[uint]bool)
			}

			if _, exists := logsSeen[logIndex]; exists {
				log.Debugf(
					"Log in block %d with log index %d already seen! Skipping",
					blockNumber,
					logIndex,
				)

				continue
			}

			logsSeen[logIndex] = true

			convertedLog := commonEth.ConvertGethLog(gethLog)

			if lastBlockSeen < blockNumber {
				writeLastBlock(blockNumber)

				lastBlockSeen = blockNumber
			}

			queue.SendMessage(queueEth.TopicLogs, convertedLog)
		}
	}
}
