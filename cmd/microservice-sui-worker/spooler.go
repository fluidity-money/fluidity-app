package main

import (
	commonSpooler "github.com/fluidity-money/fluidity-app/common/ethereum/spooler"
	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/worker"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/winners"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/sui"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/sui-go-sdk/signer"
	suiSdk "github.com/fluidity-money/sui-go-sdk/sui"
)

func payoutSpooledWinnings(client suiSdk.ISuiAPI, signer signer.Signer, fluidToken, baseToken sui.SuiToken, workerAddress string, payoutArgs payoutArgs, pendingWinners []spooler.PendingWinner) {
	var (
		workerConfig = worker.GetWorkerConfigSui()

		instantRewardThreshold = workerConfig.SpoolerInstantRewardThreshold
		batchedRewardThreshold = workerConfig.SpoolerBatchedRewardThreshold
	)

	toSend := make(map[token_details.TokenDetails]bool)

	var totalWinAmount float64

	for _, pendingWinner := range pendingWinners {
		var (
			usdAmount    = pendingWinner.UsdWinAmount
			tokenDetails = pendingWinner.TokenDetails
		)

		// from will always be greater than to
		totalWinAmount += usdAmount

		log.Debug(func(k *log.Log) {
			k.Format(
				"Reward value is $%f, instant send threshhold is $%f.",
				totalWinAmount,
				instantRewardThreshold,
			)
		})

		totalRewards := spooler.UnpaidWinningsForCategory(network.NetworkSui, tokenDetails)

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

	queue.SendMessage(winners.TopicPendingWinners, pendingWinners)

	for token, send := range toSend {
		if !send {
			// should never happen
			continue
		}

		log.Debug(func(k *log.Log) {
			k.Format("Sending rewards for token %v", token)
		})

		rewards, found, err := commonSpooler.GetRewards(network.NetworkSui, token)

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

		txnMetaData, err := createPayoutTransaction(client, fluidToken, baseToken, rewards, payoutArgs, workerAddress)
		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to create payout transaction!"
				k.Payload = err
			})
		}

		if err := makePayouts(client, signer, txnMetaData); err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to sign and execute payout transaction!"
				k.Payload = err
			})
		}
	}
}
