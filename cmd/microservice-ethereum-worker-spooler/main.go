// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/winners"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/common/ethereum"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// EnvEthereumHttpUrl to use to look up the worker config onchain for each token
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvRewardsAmqpQueueName is the queue to post winners down
	EnvRewardsAmqpQueueName = `FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME`

	// EnvPublishAmqpQueueName is the queue to post batched winners down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME`

	// EnvWorkerConfigAddress to use for looking up the specific TRF configuration per supported contract
	EnvWorkerConfigAddress = `FLU_ETHEREUM_WORKER_CONFIG_ADDR`

	// EnvNetwork to differentiate between eth, arbitrum, etc
	EnvNetwork = `FLU_ETHEREUM_NETWORK`

	// EnvTokensList to convert the received token names to a contract address
	// of the form ADDR1:TOKEN1:DECIMALS1,ADDR2:TOKEN2:DECIMALS2,...
	EnvTokensList = "FLU_ETHEREUM_TOKENS_LIST"
)

func main() {
	var (
		ethereumUrl         = util.GetEnvOrFatal(EnvEthereumHttpUrl)
		rewardsQueue        = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
		batchedRewardsQueue = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		network_            = util.GetEnvOrFatal(EnvNetwork)
		tokensList_          = util.GetEnvOrFatal(EnvTokensList)

		workerConfigAddress_ = util.GetEnvOrFatal(EnvWorkerConfigAddress)
	)

	log.Debug(func(k *log.Log) {
		k.Format(
			"Using worker config address %#v",
			workerConfigAddress_,
		)
	})

	workerConfigAddress := ethCommon.HexToAddress(workerConfigAddress_)

	gethClient, err := ethclient.Dial(ethereumUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to dial Ethereum RPC!"
			k.Payload = err
		})
	}

	defer gethClient.Close()

	dbNetwork, err := network.ParseEthereumNetwork(network_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to read the network from env!"
			k.Payload = err
		})
	}

	tokensList := ethereum.GetTokensListEthereum(tokensList_)

	tokenAddresses := make(map[string]ethCommon.Address, 0)

	for _, details := range tokensList {
		tokenName := "f" + details.TokenName
		tokenAddresses[tokenName] = details.FluidAddress
	}

	queue.GetMessages(rewardsQueue, func(message queue.Message) {
		var announcements []worker.EthereumWinnerAnnouncement

		message.Decode(&announcements)

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

				tokenName     = tokenDetails.TokenShortName
				tokenDecimals = tokenDetails.TokenDecimals

				blockNumber = uint64(blockNumberInt.Int64())
			)

			tokenAddress, ok := tokenAddresses[tokenName]

			if !ok {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to find the token name %#v in the provided %#v",
						tokenName,
						tokensList_,
					)
				})
			}

			workerConfig, err := fluidity.GetTokenWorkerConfig(
				gethClient,
				workerConfigAddress,
				tokenAddress,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to get the token worker config from %#v for %#v!",
						workerConfigAddress,
						tokenAddress,
					)

					k.Payload = err
				})
			}

			var (
				instantRewardThreshold = workerConfig.SpoolerInstantRewardThreshold
				batchedRewardThreshold = workerConfig.SpoolerBatchedRewardThreshold
			)

			tokenDecimalsScale := bigExp10(int64(tokenDecimals))

			instantRewardThresholdNormal := new(big.Rat).SetFrac(
				instantRewardThreshold,
				tokenDecimalsScale,
			)

			batchedRewardThresholdNormal := new(big.Rat).SetFrac(
				batchedRewardThreshold,
				tokenDecimalsScale,
			)

			// write the sender and receiver to be stored once the win is paid out
			winners.InsertPendingRewardType(
				dbNetwork,
				tokenDetails,
				blockNumber,
				transactionHash,
				senderAddress,
				*fromWinAmount,
				recipientAddress,
				*toWinAmount,
				application,
			)

			// winAmount / decimalScale
			scaledWinAmount := new(big.Rat).SetFrac(&fromWinAmount.Int, tokenDecimalsScale)

			log.Debug(func(k *log.Log) {
				k.Format("base amt $%s, decimals %s", fromWinAmount.String(), tokenDecimalsScale.String())
			})

			log.Debug(func(k *log.Log) {
				k.Format(
					"Reward value is $%s, instant send threshhold is $%#v.",
					scaledWinAmount.FloatString(2),
					instantRewardThresholdNormal.FloatString(5),
				)
			})

			totalRewards := spooler.UnpaidWinningsForToken(dbNetwork, tokenDetails)

			scaledBatchedRewards := new(big.Rat).SetFrac(totalRewards, tokenDecimalsScale)

			log.Debug(func(k *log.Log) {
				k.Format(
					"Total pending rewards are $%s, threshhold is $%v.",
					scaledBatchedRewards.FloatString(2),
					batchedRewardThresholdNormal,
				)
			})

			switch true {
			// scaledWinAmount > instantRewardThresholdNormal
			case scaledWinAmount.Cmp(instantRewardThresholdNormal) > 1:
				log.App(func(k *log.Log) {
					k.Format(
						"Transaction %#v won more than instant send threshold (%#v), sending instantly!",
						transactionHash,
						instantRewardThresholdNormal.FloatString(5),
					)
				})

				toSend[tokenDetails] = true

			// scaledBatchedRewardsFloat > batchedRewardThresholdNormal
			case scaledBatchedRewards.Cmp(batchedRewardThresholdNormal) > 1:
				log.App(func(k *log.Log) {
					k.Format(
						"Total pending rewards (%#v) greater than threshold (%#v), sending for tx %#v!",
						scaledBatchedRewards.FloatString(5),
						batchedRewardThresholdNormal.FloatString(5),
						transactionHash,
					)
				})

				toSend[tokenDetails] = true
			}
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
	})
}
