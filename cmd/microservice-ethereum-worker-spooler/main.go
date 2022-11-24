// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"

	workerDb "github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvRewardsAmqpQueueName is the queue to post winners down
	EnvRewardsAmqpQueueName = `FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME`

	// EnvPublishAmqpQueueName is the queue to post batched winners down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME`

	// EnvNetwork to differentiate between eth, arbitrum, etc
	EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

func main() {
	var (
		rewardsQueue        = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
		batchedRewardsQueue = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		network_            = util.GetEnvOrFatal(EnvNetwork)
	)

	dbNetwork, err := network.ParseEthereumNetwork(network_)

	if err != nil {
		log.Fatal(func (k *log.Log) {
			k.Message = "Failed to read the network from env!"
			k.Payload = err
		})
	}

	queue.GetMessages(rewardsQueue, func(message queue.Message) {
		var announcements []worker.EthereumWinnerAnnouncement

		message.Decode(&announcements)

		var (
			workerConfig = workerDb.GetWorkerConfigEthereum(dbNetwork)

			instantRewardThreshold = workerConfig.SpoolerInstantRewardThreshold
			batchedRewardThreshold = workerConfig.SpoolerBatchedRewardThreshold
		)

		toSend := make(map[token_details.TokenDetails]bool)

		for _, announcement := range announcements {
			// write the winner into the database
			spooler.InsertPendingWinners(announcement)

			var (
				// the sender's winnings will always be higher than the recipient's
				fromWinAmount = announcement.FromWinAmount
				tokenDetails  = announcement.TokenDetails
				tokenDecimals = tokenDetails.TokenDecimals

				transactionHash  = announcement.TransactionHash
				senderAddress    = announcement.FromAddress
				recipientAddress = announcement.ToAddress
				application      = announcement.Application
			)

			// write the sender and receiver to be stored once the win is paid out
			winners.InsertPendingRewardType(transactionHash, senderAddress, recipientAddress, application)

			tokenDecimalsScale := bigExp10(int64(tokenDecimals))

			// winAmount / decimalScale
			scaledWinAmount := new(big.Rat).SetFrac(&fromWinAmount.Int, tokenDecimalsScale)

			log.Debug(func(k *log.Log) {
				k.Format("base amt $%s, decimals %s", fromWinAmount.String(), tokenDecimalsScale.String())
			})

			log.Debug(func(k *log.Log) {
				k.Format(
					"Reward value is $%s, instant send threshhold is $%f.",
					scaledWinAmount.FloatString(2),
					instantRewardThreshold,
				)
			})

			totalRewards := spooler.UnpaidWinningsForToken(dbNetwork, tokenDetails)

			scaledBatchedRewards := new(big.Rat).SetFrac(totalRewards, tokenDecimalsScale)

			log.Debug(func(k *log.Log) {
				k.Format(
					"Total pending rewards are $%s, threshhold is $%f.",
					scaledBatchedRewards.FloatString(2),
					batchedRewardThreshold,
				)
			})

			var (
				scaledWinAmountFloat, _ = scaledWinAmount.Float64()
				scaledBatchedRewardsFloat, _ = scaledBatchedRewards.Float64()
			)

			if scaledWinAmountFloat > instantRewardThreshold {
				log.Debug(func(k *log.Log) {
					k.Message = "Transaction won more than instant send threshold, sending instantly!"
				})

				toSend[tokenDetails] = true
			} else if scaledBatchedRewardsFloat > batchedRewardThreshold {
				log.Debug(func(k *log.Log) {
					k.Message = "Total pending rewards are greater than threshold, sending!"
				})

				toSend[tokenDetails] = true
			}

			for shortName, send := range toSend {
				if !send {
					// should never happen
					continue
				}

				log.Debug(func(k *log.Log) {
					k.Format("Sending rewards for token %v", shortName)
				})

				sendRewards(batchedRewardsQueue, dbNetwork, shortName)
			}
		}
	})
}
