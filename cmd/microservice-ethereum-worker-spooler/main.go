// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	commonSpooler "github.com/fluidity-money/fluidity-app/common/ethereum/spooler"
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
		log.Fatal(func(k *log.Log) {
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
				fromWinAmount    = announcement.FromWinAmount
				tokenDetails     = announcement.TokenDetails
				blockNumberInt   = announcement.BlockNumber
				transactionHash  = announcement.TransactionHash
				senderAddress    = announcement.FromAddress
				recipientAddress = announcement.ToAddress
				toWinAmount      = announcement.ToWinAmount
				application      = announcement.Application
				rewardTier       = announcement.RewardTier
				logIndex         = announcement.LogIndex

				blockNumber = uint64(blockNumberInt.Int64())
			)

			log.Debug(func(k *log.Log) {
				k.Format(
					"Inserting pending reward type for transaction with hash %v and application %v",
					transactionHash,
					application.String(),
				)
			})

			// write the sender and receiver to be stored once the win is paid out
			winners.InsertPendingRewardType(
				dbNetwork,
				tokenDetails,
				blockNumber,
				transactionHash,
				senderAddress,
				fromWinAmount,
				recipientAddress,
				toWinAmount,
				application,
				rewardTier,
				*logIndex,
			)

			var totalWinAmount float64

			// from will always be greater than to
			for _, payout := range fromWinAmount {
				totalWinAmount += payout.Usd
			}

			log.Debug(func(k *log.Log) {
				k.Format(
					"Reward value is $%f, instant send threshhold is $%f.",
					totalWinAmount,
					instantRewardThreshold,
				)
			})

			totalRewards := spooler.UnpaidWinningsForToken(dbNetwork, tokenDetails)

			log.Debug(func(k *log.Log) {
				k.Format(
					"Total pending rewards are $%f, threshhold is $%f.",
					totalRewards,
					batchedRewardThreshold,
				)
			})

			if totalWinAmount > instantRewardThreshold {
				log.Debug(func(k *log.Log) {
					k.Message = "Transaction won more than instant send threshold, sending instantly!"
				})

				toSend[tokenDetails] = true
			} else if totalRewards > batchedRewardThreshold {
				log.Debug(func(k *log.Log) {
					k.Message = "Total pending rewards are greater than threshold, sending!"
				})

				toSend[tokenDetails] = true
			}
		}

		for token, send := range toSend {
			if !send {
				// should never happen
				continue
			}

			log.Debug(func(k *log.Log) {
				k.Format("Sending rewards for token %v", token)
			})

			rewards, found, err := commonSpooler.GetRewards(dbNetwork, token)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to get rewards for token %s! %+v",
						token.TokenShortName,
						err,
					)
				})
			}

			if !found {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Trying to send rewards for token %s but no rewards found!",
						token.TokenShortName,
					)
				})
			}

			queue.SendMessage(batchedRewardsQueue, rewards)
		}
	})
}
