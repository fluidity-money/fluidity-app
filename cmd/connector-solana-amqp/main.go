package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/src/connector-solana-amqp/queue"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/fluidity-money/fluidity-app/src/connector-solana-amqp/solana"
	"github.com/fluidity-money/fluidity-app/src/connector-solana-amqp/redis"
)

const (
	// RedisBlockKey is the key to find the lastest confirmed slot we've seen
	RedisBlockKey = `solana.confirmed-blocks.latest`

	// BlockPageLength is the number of confirmed blocks to fetch at once
	BlockPageLength = 1000

	// EnvSolanaWsUrl is the URL to connect to the Solana websocket api
	EnvSolanaWsUrl = `FLU_SOLANA_WS_URL`

	// EnvSolanaRpcUrl is the URL to make solana RPC calls to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvStartingSlot is the slot to start from if the Redis key is not set
	EnvStartingSlot = `FLU_SOLANA_STARTING_SLOT`
)

func updateConfirmedBlocksFrom(rpcUrl string, from uint64) (uint64, error) {
	var lastBlock uint64 = 0
	for {
		blocks, err := solana.GetConfirmedBlocks(rpcUrl, from, BlockPageLength)

		if err != nil {
			return 0, fmt.Errorf("Failed to get confirmed blocks! %w", err)
		}

		log.Debug(func (k *log.Log) {
			k.Format("Got confirmed blocks from solana! %+v", blocks)
		})

		queue.SendConfirmedBlocks(blocks)

		if len(blocks) == 0 {
			// we're fetching past the end
			log.Debug(func (k *log.Log) {
				k.Format("Trying to fetch block %d past the end", from)
			})

			return lastBlock, nil
		}

		lastBlock = blocks[len(blocks) - 1]

		if len(blocks) != BlockPageLength {
			// we've fetched everything
			log.Debug(func (k *log.Log) {
				k.Format("Done fetching up to block %d", lastBlock)
			})

			return lastBlock, nil
		}

		// keep fetching from the last slot we just saw
		from = lastBlock + 1

		log.Debug(func (k *log.Log) {
			k.Format("Continuing fetch from block %d", from)
		})
	}
}

func main() {
	var (
		solanaWsUrl = util.GetEnvOrFatal(EnvSolanaWsUrl)
		solanaRpcUrl = util.GetEnvOrFatal(EnvSolanaRpcUrl)

		slotsChan = make(chan types.Slot)
		errChan  = make(chan error)
	)

	var (
		startingBlock    uint64
		startingBlockEnv = os.Getenv(EnvStartingSlot)
	)

	latestSlot, err := solana.GetLatestSlot(solanaRpcUrl)

	if err != nil {
		log.Fatal(func (k *log.Log) {
			k.Message = "Failed to get latest slot!"
			k.Payload = err
		})
	}

	switch startingBlockEnv {
	case "latest":
		startingBlock = latestSlot - 1

		log.Debug(func (k *log.Log) {
			k.Format("Starting from latest slot %d", latestSlot)
		})

	case "":
		// default to the last slot in redis
		startingBlock = redis.GetLastBlock(RedisBlockKey)

		log.Debug(func (k *log.Log) {
			k.Format(
				"Starting from last seen slot %d, max on chain is %d",
				startingBlock,
				latestSlot,
			)
		})

	default:
		startingBlock, err = strconv.ParseUint(startingBlockEnv, 10, 64)

		if err != nil {
			log.Fatal(func (k *log.Log) {
				k.Message = "Failed to parse starting slot from env!"
				k.Payload = err
			})
		}

		startingBlock = startingBlock - 1
	}

	solanaSubscription, err := solana.SubscribeSlots(solanaWsUrl, slotsChan, errChan)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to subscribe to solana events!"
			k.Payload = err
		})
	}

	defer solanaSubscription.Close()

	latestBlockSeen := startingBlock - 1

	for {
		select {
		case <-slotsChan:
			log.Debug(func (k *log.Log) {
				k.Message = "Got a new slot from solana!"
			})

			latestBlockSent, err := updateConfirmedBlocksFrom(solanaRpcUrl, latestBlockSeen + 1)

			if err != nil {
				log.Fatal(func (k *log.Log) {
					k.Message = "Failed to fetch confirmed blocks!"
					k.Payload = err
				})
			}

			if latestBlockSent > latestBlockSeen {
				latestBlockSeen = latestBlockSent

				redis.WriteLastBlock(RedisBlockKey, latestBlockSeen)
			} else {
				log.Debug(func (k *log.Log) {
					k.Format(
						"Last seen block is before what we think we've sent! We can see %d, we've sent %d!",
						latestBlockSeen,
						latestBlockSent,
					)
				})
			}

		case err := <-errChan:
			log.Fatal(func(k *log.Log) {
				k.Message = "Error from the Solana websocket!"
				k.Payload = err
			})

			return
		}
	}
}
