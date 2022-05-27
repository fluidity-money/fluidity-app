package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvRewardsAmqpQueueName is the queue to post winners down
	EnvRewardsAmqpQueueName = `FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME`

	// EnvPublishAmqpQueueName is the queue to post batched winners down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME`

	// EnvInstantRewardThreshhold is the amount (in dollars) above which a
	// reward should be sent instantly
	EnvInstantRewardThreshhold = `FLU_ETHEREUM_SPOOLER_INSTANT_REWARD_THRESHHOLD`

	// EnvInstantRewardThreshhold is the amount (in dollars) above which
	// rewards should be sent if the total pending amount of rewards is greater
	EnvTotalRewardThreshhold = `FLU_ETHEREUM_SPOOLER_TOTAL_REWARD_THRESHHOLD`
)

func main() {
	var (
		rewardsQueue           = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
		batchedRewardsQueue    = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		instantRewardThreshold = intFromEnvOrFatal(EnvInstantRewardThreshhold)
		totalRewardThreshold   = intFromEnvOrFatal(EnvTotalRewardThreshhold)
	)

	queue.GetMessages(rewardsQueue, func(message queue.Message) {
		var announcements []worker.EthereumWinnerAnnouncement

		message.Decode(&announcements)

		toSend := make(map[string]bool)

		for _, announcement := range announcements {
			// write the winner into the database
			spooler.InsertPendingWinner(announcement)

			var (
				winAmount      = announcement.WinAmount
				tokenDetails   = announcement.TokenDetails
				tokenShortName = tokenDetails.TokenShortName
				tokenDecimals  = tokenDetails.TokenDecimals
			)

			tokenDecimalsNum := bigExp10(int64(tokenDecimals))

			scaledWinAmount := new(misc.BigInt).Div(&winAmount.Int, tokenDecimalsNum)

			log.Debug(func(k *log.Log) {
				k.Format(
					"Reward value is $%s, instant send threshhold is $%d.",
					scaledWinAmount.String(),
					instantRewardThreshold,
				)
			})

			totalRewards := spooler.UnpaidWinningsForToken(tokenDetails)

			scaledTotalRewards := new(big.Int).Div(totalRewards, tokenDecimalsNum)

			log.Debug(func(k *log.Log) {
				k.Format(
					"Total pending rewards are $%s, threshhold is $%d.",
					scaledTotalRewards.String(),
					totalRewardThreshold,
				)
			})

			switch true {

			case scaledWinAmount.Int64() >= instantRewardThreshold:
				log.Debug(func(k *log.Log) {
					k.Message = "Transaction won more than instant send threshold, sending instantly!"
				})

				toSend[tokenShortName] = true

				continue

			case scaledTotalRewards.Int64() >= totalRewardThreshold:
				log.Debug(func(k *log.Log) {
					k.Message = "Total pending rewards are greater than threshold, sending!"
				})

				toSend[tokenShortName] = true

				continue
			}
		}

		for shortName, send := range toSend {
			if !send {
				// should never happen
				continue
			}

			log.Debug(func (k *log.Log) {
			    k.Format("Sending rewards for token %s", shortName)
			})

			sendRewards(batchedRewardsQueue, shortName)
		}
	})
}
