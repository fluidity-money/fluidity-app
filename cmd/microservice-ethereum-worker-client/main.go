// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/common/calculation/probability"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvPublishAmqpQueueName to use to receive RLP-encoded blobs down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_AMQP_QUEUE_NAME`

	// EnvRewardsAmqpQueueName is the queue to post winners down
	EnvRewardsAmqpQueueName = `FLU_ETHEREUM_AMQP_PUBLISH_NAME`

	// EnvNetwork to differentiate between eth, arbitrum, etc
	EnvNetwork = `FLU_ETHEREUM_NETWORK`
)

var (
	// ethereumNullAddress to filter for not including in either side of a
	// transfer to prevent burning and minting
	ethereumNullAddress = ethereum.AddressFromString("0000000000000000000000000000000000000000")
)

// ethereumUniqueTransfer identifies a transfer uniquely
type ethereumUniqueTransfer struct {
	transactionHash string
	logIndex        string
}

func main() {
	var (
		publishAmqpQueueName = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		rewardsAmqpQueueName = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
		net_                 = util.GetEnvOrFatal(EnvNetwork)
	)

	network_, err := network.ParseEthereumNetwork(net_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to read an ethereum network from env!"
			k.Payload = err
		})
	}

	queue.GetMessages(publishAmqpQueueName, func(message queue.Message) {

		var announcements []worker.EthereumAnnouncement
		message.Decode(&announcements)

		processAnnouncements(announcements, rewardsAmqpQueueName, network_)
	})
}

func mergePayouts(source map[applications.UtilityName]worker.Payout, dest map[applications.UtilityName]worker.Payout) {
	for app, sourcePayout := range source {
		// dest is passed by implicit reference !!
		destPayout, exists := dest[app]

		if !exists {
			destPayout = sourcePayout
		} else {
			destPayout.Usd += sourcePayout.Usd
			destPayout.Native.Add(&sourcePayout.Native.Int, &destPayout.Native.Int)
		}

		dest[app] = destPayout
	}
}

// processAnnouncements to handle fluid transfer or application-based win
// announcements and determine their winning status
func processAnnouncements(announcements []worker.EthereumAnnouncement, rewardsAmqpQueueName string, network_ network.BlockchainNetwork) {
	winAnnouncements := make(map[ethereumUniqueTransfer]worker.EthereumWinnerAnnouncement)

	for _, announcement := range announcements {

		var (
			announcementTransactionHash = announcement.TransactionHash
			blockNumber                 = announcement.BlockNumber
			logIndex                    = announcement.LogIndex
			fromAddress                 = announcement.FromAddress
			toAddress                   = announcement.ToAddress
			sourceRandom                = announcement.RandomSource
			sourcePayouts               = announcement.RandomPayouts
			emission                    = announcement.Emissions
			tokenDetails                = announcement.TokenDetails
			application                 = announcement.Application
		)

		if fromAddress == ethereumNullAddress {
			log.App(func(k *log.Log) {
				k.Format(
					"From address was nil in transaction hash %#v! To was set to %#v!",
					announcementTransactionHash,
					toAddress,
				)
			})

			continue
		}

		if toAddress == ethereumNullAddress {
			log.App(func(k *log.Log) {
				k.Format(
					"To address was nil in transaction hash %#v! From was set to %#v!",
					announcementTransactionHash,
					fromAddress,
				)
			})

			continue
		}

		// check win status

		winningBalls := probability.NaiveIsWinning(sourceRandom, &emission)

		if winningBalls == 0 {
			log.App(func(k *log.Log) {
				k.Format(
					"From %#v to %#v transaction hash %#v didn't win anything!",
					fromAddress,
					toAddress,
					announcementTransactionHash,
				)
			})

			continue
		}

		fromWinAmounts, toWinAmounts := probability.CalculatePayoutsSplit(sourcePayouts, winningBalls)

		log.App(func(k *log.Log) {
			k.Format(
				"Transaction hash %#v with transaction from %#v to %#v and application %v has won: %#v won %s,%#v won %s",
				announcementTransactionHash,
				fromAddress,
				toAddress,
				application.String(),
				fromAddress,
				formatPayouts(fromWinAmounts),
				toAddress,
				formatPayouts(toWinAmounts),
			)
		})

		id := ethereumUniqueTransfer{
			transactionHash: announcementTransactionHash.String(),
			logIndex:        logIndex.String(),
		}

		winAnnouncement, exists := winAnnouncements[id]

		if !exists {
			winAnnouncement = worker.EthereumWinnerAnnouncement{
				Network:         network_,
				TransactionHash: announcementTransactionHash,
				LogIndex:        logIndex,
				BlockNumber:     blockNumber,
				FromAddress:     fromAddress,
				FromWinAmount:   make(map[applications.UtilityName]worker.Payout),
				ToAddress:       toAddress,
				ToWinAmount:     make(map[applications.UtilityName]worker.Payout),
				TokenDetails:    tokenDetails,
				Application:     application,
				RewardTier:      winningBalls,
			}
		}

		mergePayouts(fromWinAmounts, winAnnouncement.FromWinAmount)
		mergePayouts(toWinAmounts, winAnnouncement.ToWinAmount)

		winAnnouncements[id] = winAnnouncement
	}

	if len(winAnnouncements) > 0 {
		var winAnnouncementsList []worker.EthereumWinnerAnnouncement

		for _, announcement := range winAnnouncements {
			winAnnouncementsList = append(winAnnouncementsList, announcement)
		}

		queue.SendMessage(rewardsAmqpQueueName, winAnnouncementsList)
	}
}
