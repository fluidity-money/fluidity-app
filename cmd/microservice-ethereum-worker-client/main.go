package main

import (
	"github.com/fluidity-money/fluidity-app/common/calculation/probability"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvPublishAmqpQueueName to use to receive RLP-encoded blobs down
	EnvPublishAmqpQueueName = `FLU_ETHEREUM_AMQP_QUEUE_NAME`

	// EnvRewardsAmqpQueueName is the queue to post winners down
	EnvRewardsAmqpQueueName = `FLU_ETHEREUM_AMQP_PUBLISH_NAME`

	// ethereumNullAddress to filter for not including in either side of a
	// transfer to prevent burning and minting
	ethereumNullAddress = "0000000000000000000000000000000000000000"
)

func main() {
	var (
		publishAmqpQueueName = util.GetEnvOrFatal(EnvPublishAmqpQueueName)
		rewardsAmqpQueueName = util.GetEnvOrFatal(EnvRewardsAmqpQueueName)
	)

	var err error

	queue.GetMessages(publishAmqpQueueName, func(message queue.Message) {

		var announcements []worker.EthereumAnnouncement

		message.Decode(&announcements)

		var winAnnouncements []worker.EthereumWinnerAnnouncement

		for _, announcement := range announcements {

			var (
				announcementTransactionHash = announcement.TransactionHash
				blockNumber                 = announcement.BlockNumber
				fromAddress                 = announcement.FromAddress
				toAddress                   = announcement.ToAddress
				sourceRandom                = announcement.SourceRandom
				sourcePayouts               = announcement.SourcePayouts
				emission                    = announcement.Emissions
				tokenDetails                = announcement.TokenDetails
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to decode an announcement RLP encoded message!"
					k.Payload = err
				})
			}

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

			fromWinAmount, toWinAmount := calculatePayouts(sourcePayouts, winningBalls)

			log.App(func(k *log.Log) {
				k.Format(
					"Transaction hash %#v with transaction from %#v to %#v has won: %#v won %s,%#v won %s",
					announcementTransactionHash,
					fromAddress,
					toAddress,
					fromAddress,
					fromWinAmount.String(),
					toAddress,
					toWinAmount.String(),
				)
			})

			winAnnouncement := worker.EthereumWinnerAnnouncement {
				TransactionHash: announcementTransactionHash,
				BlockNumber:   blockNumber,
				FromAddress:   fromAddress,
				FromWinAmount: fromWinAmount,
				ToAddress:     toAddress,
				ToWinAmount:   toWinAmount,
				TokenDetails:  tokenDetails,
			}

			winAnnouncements = append(winAnnouncements, winAnnouncement)
		}

		queue.SendMessage(rewardsAmqpQueueName, winAnnouncements)
	})
}
