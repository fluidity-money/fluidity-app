package main

import (
	"github.com/fluidity-money/fluidity-app/common/calculation/probability"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvContractAddress is the contract to call when a winner's been found!
	// EnvEthereumWsUrl is the url to use to connect to the WS Geth endpoint
	EnvEthereumHttpUrl = `FLU_ETHEREUM_HTTP_URL`

	// EnvPrivateKey is the hex-encoded private key used to sign calls to the reward function
	EnvPrivateKey = `FLU_ETHEREUM_WORKER_PRIVATE_KEY`

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

		var announcement worker.EthereumAnnouncement

		message.Decode(&announcement)

		var (
			announcementTransactionHash = announcement.TransactionHash
			fromAddress                 = announcement.FromAddress
			toAddress                   = announcement.ToAddress
			sourceRandom                = announcement.SourceRandom
			sourcePayouts               = announcement.SourcePayouts
			emission                    = announcement.Emissions
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

			return
		}

		if toAddress == ethereumNullAddress {
			log.App(func(k *log.Log) {
				k.Format(
					"To address was nil in transaction hash %#v! From was set to %#v!",
					announcementTransactionHash,
					fromAddress,
				)
			})

			return
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

			return
		}

		winningAmount := sourcePayouts[winningBalls-1]

		log.App(func(k *log.Log) {
			k.Format(
				"Transaction hash %#v with transaction from %#v to %#v has won: %v",
				announcementTransactionHash,
				fromAddress,
				toAddress,
				winningAmount,
			)
		})

		winAnnouncement := worker.EthereumWinnerAnnouncement {
			TransactionHash: announcementTransactionHash,
			FromAddress: fromAddress.String(),
			ToAddress: toAddress.String(),
			WinAmount: winningAmount,
		}

		queue.SendMessage(rewardsAmqpQueueName, winAnnouncement)
	})
}
