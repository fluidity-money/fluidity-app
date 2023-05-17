// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"encoding/hex"
	"fmt"
	"strconv"

	lib "github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-block-fluid-transfers-amqp/lib"
	ethConvert "github.com/fluidity-money/fluidity-app/cmd/microservice-ethereum-block-fluid-transfers-amqp/lib/ethereum"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	ethQueue "github.com/fluidity-money/fluidity-app/lib/queues/ethereum"
	workerQueue "github.com/fluidity-money/fluidity-app/lib/queues/worker"
	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	worker "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvGethHttpUrl to use when performing RPC requests
	EnvGethHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvRetries is the number of times to retry block fetching
	// if a block doesn't exist yet
	EnvRetries = `FLU_ETHEREUM_BLOCK_RETRIES`

	// EnvRetryDelay is the number of seconds to wait before retrying
	// fetching a block
	EnvRetryDelay = `FLU_ETHEREUM_BLOCK_RETRY_DELAY`
)

func convertAddressToBytes(address string) ([]byte, error) {
	prefix := address[:2]
	hexValues := address[2:]

	if prefix != "0x" {
		err := fmt.Errorf("Address does not start with 0x (%v)", address)
		return []byte{}, err
	}

	return hex.DecodeString(hexValues)
}

// intFromEnvOrFatal reads an int that must exist from the environment
func intFromEnvOrFatal(env string) int {
	numString := util.GetEnvOrFatal(env)

	num, err := strconv.Atoi(numString)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("Failed to read an int from environment variable %s!", env)
			k.Payload = err
		})
	}

	return num
}

func main() {
	var (
		gethHttpApi = util.PickEnvOrFatal(EnvGethHttpUrl)

		retries = intFromEnvOrFatal(EnvRetries)
		delay   = intFromEnvOrFatal(EnvRetryDelay)
	)

	ethQueue.BlockHeaders(func(header ethereum.BlockHeader) {
		var (
			blockHash   = header.BlockHash
			blockNumber = header.Number
			baseFee     = header.BaseFee
		)

		amqpBlock := worker.EthereumBlockLog{
			BlockHash:    blockHash,
			BlockBaseFee: header.BaseFee,
			BlockTime:    header.Time,
			BlockNumber:  blockNumber,
			BaseFee:      baseFee,
			Logs:         make([]types.Log, 0),
			Transactions: make([]types.Transaction, 0),
		}


		// Block contains log with ABI hash in its topics
		// Guaranteed to be signature - Order dependent

		block, err := lib.GetBlockFromHash(gethHttpApi, blockHash.String(), retries, delay)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get a block with hash %#v!",
					blockHash.String(),
				)

				k.Payload = err
			})
		}

		newTransactions, err := ethConvert.ConvertTransactions(
			blockHash.String(),
			block.Transactions,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("Could not convert transactions from block: %v", blockHash)
				k.Payload = err
			})
		}

		amqpBlock.Transactions = append(amqpBlock.Transactions, newTransactions...)

		newFluidLogs, err := lib.GetLogsFromHash(gethHttpApi, blockHash.String())

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("Could not get logs from block: %v", blockHash)
				k.Payload = err
			})
		}

		amqpBlock.Logs = append(amqpBlock.Logs, newFluidLogs...)

		queue.SendMessage(workerQueue.TopicEthereumBlockLogs, amqpBlock)
	})
}
