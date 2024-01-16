// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"strconv"
	"strings"

	workerDb "github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/amm"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	winnersQueue "github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	commonApps "github.com/fluidity-money/fluidity-app/common/ethereum/applications"
	commonSpooler "github.com/fluidity-money/fluidity-app/common/ethereum/spooler"
)

const (
	// EnvRewardsAmqpQueueName is the queue to post winners down
	EnvRewardsAmqpQueueName = `FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME`

	// EnvPublishAmqpQueueName is the queue to post batched winners down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME`

	// EnvTokenDetails is a list of utility:shortname:decimals
	EnvTokenDetails = `FLU_ETHEREUM_UTILITY_TOKEN_DETAILS`

	// EnvNetwork to differentiate between eth, arbitrum, etc
	EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

func main() {
	var (
		rewardsQueue        = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
		batchedRewardsQueue = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		network_            = util.GetEnvOrFatal(EnvNetwork)

		tokenDetails  = make(map[applications.UtilityName]token_details.TokenDetails)
		tokenDetails_ = util.GetEnvOrFatal(EnvTokenDetails)
	)

	dbNetwork, err := network.ParseEthereumNetwork(network_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to read the network from env!"
			k.Payload = err
		})
	}

	for _, details := range strings.Split(tokenDetails_, ",") {
		parts := strings.Split(details, ":")
		if len(parts) != 3 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Invalid token details split '%s'!",
					parts,
				)
			})
		}

		utility := applications.UtilityName(parts[0])
		shortName := parts[1]
		decimals_ := parts[2]

		decimals, err := strconv.ParseInt(decimals_, 10, 64)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to parse decimals from token list env!"
				k.Payload = err
			})
		}

		tokenDetails[utility] = token_details.New(shortName, int(decimals))
	}

	queue.GetMessages(rewardsQueue, func(message queue.Message) {
		var (
			announcements  []worker.EthereumWinnerAnnouncement
			pendingWinners []spooler.PendingWinner
		)

		message.Decode(&announcements)

		var (
			workerConfig = workerDb.GetWorkerConfigEthereum(dbNetwork)

			instantRewardThreshold = workerConfig.SpoolerInstantRewardThreshold
			batchedRewardThreshold = workerConfig.SpoolerBatchedRewardThreshold
		)

		toSend := make(map[token_details.TokenDetails]bool)

		for _, announcement := range announcements {
			// write the winner into the database
			pendingWinners_ := spooler.CreatePendingWinners(announcement, tokenDetails)
			spooler.InsertPendingWinners(pendingWinners_)

			// store pending winners from all announcements to send to the queue later
			pendingWinners = append(pendingWinners, pendingWinners_...)

			// if the win was an AMM win, add the LP winnings
			if announcement.Application == commonApps.ApplicationSeawaterAmm && announcement.Decorator != nil {
				amm.InsertAmmWinnings(announcement, tokenDetails)
			}

			var (
				// the sender's winnings will always be higher than the recipient's
				fromWinAmount     = announcement.FromWinAmount
				fluidTokenDetails = announcement.TokenDetails
				blockNumberInt    = announcement.BlockNumber
				transactionHash   = announcement.TransactionHash
				senderAddress     = announcement.FromAddress
				recipientAddress  = announcement.ToAddress
				toWinAmount       = announcement.ToWinAmount
				application       = announcement.Application
				rewardTier        = announcement.RewardTier
				logIndex          = announcement.LogIndex

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
				fluidTokenDetails,
				blockNumber,
				transactionHash,
				senderAddress,
				fromWinAmount,
				recipientAddress,
				toWinAmount,
				application,
				rewardTier,
				*logIndex,
				tokenDetails,
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

			totalRewards := spooler.UnpaidWinningsForCategory(dbNetwork, fluidTokenDetails)

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

				toSend[fluidTokenDetails] = true
			} else if totalRewards > batchedRewardThreshold {
				log.Debug(func(k *log.Log) {
					k.Message = "Total pending rewards are greater than threshold, sending!"
				})

				toSend[fluidTokenDetails] = true
			}

			queue.SendMessage(winnersQueue.TopicPendingWinners, pendingWinners)
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
