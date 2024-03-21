// Copyright 2024 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"context"
	"math/big"
	"strconv"
	"time"

	"github.com/fluidity-money/sui-go-sdk/models"

	"github.com/fluidity-money/sui-go-sdk/sui"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	sui_queue "github.com/fluidity-money/fluidity-app/lib/queues/sui"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	sui_types "github.com/fluidity-money/fluidity-app/lib/types/sui"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	RedisLastCheckpoint  = `sui.last-checkpoint`

	// RedisBufferSize is the length of the buffer for previously seen blocks
	RedisBufferSize = 100
)

const (
	// EnvSuiHttpUrl is the HTTP URL of a Sui RPC endpoint
	EnvSuiHttpUrl = `FLU_SUI_HTTP_URL`

	// EnvFirstCheckpoint is the checkpoint to begin watching from, overriding the last block
	EnvFirstCheckpoint = `FLU_SUI_FIRST_CHECKPOINT`

	// EnvPaginationWaitTime is the number of seconds to wait between paginating checkpoints
	EnvPaginationWaitTime = `FLU_SUI_PAGINATION_WAIT_TIME_SECONDS`
)

func main() {
	var (
		suiHttpUrl = util.GetEnvOrFatal(EnvSuiHttpUrl)
		// by default, start from the very first block
		firstCheckpointEnv = util.GetEnvOrDefault(EnvFirstCheckpoint, "0")
		// by default, wait 5 seconds when no checkpoints are available, doubling each time
		waitTimeString = util.GetEnvOrDefault(EnvPaginationWaitTime, "5")

		httpClient = sui.NewSuiClient(suiHttpUrl)
	)

	firstCheckpoint, err := strconv.ParseUint(firstCheckpointEnv, 10, 64)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse starting checkpoint from env!"
			k.Payload = err
		})
	}

	// if unset, try use the last checkpoint
	if firstCheckpoint == 0 {
		firstCheckpoint = GetLastBlock(RedisLastCheckpoint)
	}

	// if env unset and nothing in Redis, start from the very first block
	// TODO - this maybe shouldn't be allowed as the contract will never be deployed in the first block
	if firstCheckpoint != 0 {
		firstCheckpoint -= 1
	}

	waitSeconds, err := strconv.ParseUint(waitTimeString, 10, 64)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse pagination wait time from env!"
			k.Payload = err
		})
	}

	waitTime := time.Duration(time.Second * time.Duration(waitSeconds))

	paginateCheckpoints(httpClient, firstCheckpoint, waitTime)
}

// paginateCheckpoints to infinitely search for new checkpoints and send them down a queue
func paginateCheckpoints(client sui.ISuiAPI, firstCheckpoint uint64, waitDuration time.Duration) {
	var lastCheckpoint uint64 = GetLastBlock(RedisLastCheckpoint)

	// user-set checkpoint takes precedence
	if lastCheckpoint < firstCheckpoint {
		lastCheckpoint = firstCheckpoint
	}

	for {
		currentCheckpoint, err := client.SuiGetLatestCheckpointSequenceNumber(context.Background())

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get latest checkpoint sequence number!"
				k.Payload = err
			})
		}

		log.Debug(func(k *log.Log) {
			k.Format(
				"Last checkpoint %v, first %v, current %v",
				lastCheckpoint,
				firstCheckpoint,
				currentCheckpoint,
			)
		})

		// wait with a backoff for there to be at least 25 new checkpoints
		if currentCheckpoint <= lastCheckpoint+25 {
			log.Debug(func(k *log.Log) {
				k.Format(
					"Last checkpoint %v, current %v, wanted %v, waiting %v seconds!",
					lastCheckpoint,
					currentCheckpoint,
					lastCheckpoint+25,
					waitDuration.Seconds(),
				)
			})

			time.Sleep(waitDuration)
			waitDuration *= 2

			continue
		} else {
			waitDuration = time.Duration(time.Second * 5)
		}

		cursor := strconv.Itoa(int(lastCheckpoint))

		// not up to date, fetch up to limit (50 is a hard limit in the Go SDK - the RPC limit is either 50 or 100)
		checkpointsResponse, err := client.SuiGetCheckpoints(context.Background(), models.SuiGetCheckpointsRequest{
			Cursor:          cursor,
			Limit:           50,
			DescendingOrder: false,
		})

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get Sui checkpoints using cursor %v",
					lastCheckpoint,
				)
				k.Payload = err
			})
		}

		// send minimal checkpoints individually down queue
		for _, checkpoint := range checkpointsResponse.Data {
			var (
				sequenceNumberString = checkpoint.SequenceNumber
				timestampMs          = checkpoint.TimestampMs
				transactions         = checkpoint.Transactions
			)

			sequenceNumber, err := strconv.ParseUint(sequenceNumberString, 10, 64)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to convert sequence number %v to a number!",
						sequenceNumberString,
					)
					k.Payload = err
				})
			}

			// convert Unix MS timestamp to Go time
			timestamp_, err := strconv.ParseInt(timestampMs, 10, 64)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to convert checkpoint timestamp %v to a number!",
						timestampMs,
					)
					k.Payload = err
				})
			}

			timestamp := time.Unix(timestamp_/1000, 0).UTC()

			WriteLastBlock(RedisLastCheckpoint, sequenceNumber)

			sequenceNumberInt, ok := new(big.Int).SetString(sequenceNumberString, 10)

			if !ok {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to convert sequence number to bigint!"
					k.Payload = sequenceNumberString
				})
			}

			checkpoint := sui_types.Checkpoint{
				SequenceNumber: misc.NewBigIntFromInt(*sequenceNumberInt),
				Timestamp:      timestamp,
				Transactions:   transactions,
			}
			queue.SendMessage(sui_queue.TopicCheckpoints, checkpoint)

			log.Debug(func(k *log.Log) {
				k.Format(
					"Sent checkpoint %v to queue",
					sequenceNumber,
				)
			})

			lastCheckpoint = sequenceNumber
		}

		if !checkpointsResponse.HasNextPage {
			log.Debug(func(k *log.Log) {
				k.Message = "Up to date, sleeping!"
			})
			time.Sleep(waitDuration)
		}
	}
}
