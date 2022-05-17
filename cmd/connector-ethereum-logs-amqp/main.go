package main

import (
	"context"
	"fmt"
	"os"
	"strconv"

	"github.com/ethereum/go-ethereum"
	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	ethRpc "github.com/ethereum/go-ethereum/rpc"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	queueEth "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	commonEth "github.com/fluidity-money/fluidity-app/common/ethereum"
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

	// TopicLogs to use when writing logs found with Ethereum
	TopicLogs = queueEth.TopicLogs

	// PaginateBlockAmount to paginate until up to speed with
	// the current block height
	PaginateBlockAmount = 10
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
func paginateLogs(client *ethclient.Client, fromBlockHeight uint64, chanLogs chan ethTypes.Log) (uint64, error) {
	currentBlockHeight, err := getLatestBlockHeight(client)

	if err != nil {
		return 0, err
	}

	nextBlockHeight := fromBlockHeight + PaginateBlockAmount

	filterQuery := ethereum.FilterQuery{
		FromBlock: newBig(fromBlockHeight),
		ToBlock:   newBig(nextBlockHeight),
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
			debug(
				"Block below the current pagination item of %v was found, ignoring!",
				blockNumber,
			)

			continue
		}

		chanLogs <- ethLog
	}

	if nextBlockHeight < currentBlockHeight {
		return paginateLogs(
			client,
			nextBlockHeight,
			chanLogs,
		)
	}

	return nextBlockHeight, nil
}

func main() {
	ethereumWsUrl := util.GetEnvOrFatal(EnvEthereumWsUrl)

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
			startingBlock+PaginateBlockAmount,
		)
	})

	chanGethLogs := make(chan ethTypes.Log)

	go func() {
		currentBlockHeight, err := paginateLogs(
			gethClient,
			startingBlock,
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
			"address": nil,
			"topics":  nil,
		}

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

	var lastBlockSeen uint64 = 0

	for {
		debug("Waiting for new messages from Geth!")

		select {
		case gethLog := <-chanGethLogs:

			var (
				blockNumber = gethLog.BlockNumber
				isRemoved   = gethLog.Removed
			)

			debug(
				"Received a log at block number %v!",
				blockNumber,
			)

			if isRemoved {
				debug(
					"Log at block number %#v was removed!",
					blockNumber,
				)

				continue
			}

			convertedLog := commonEth.ConvertGethLog(gethLog)

			if lastBlockSeen < blockNumber {
				writeLastBlock(blockNumber)

				lastBlockSeen = blockNumber
			}

			queue.SendMessage(queueEth.TopicLogs, convertedLog)
		}
	}
}
