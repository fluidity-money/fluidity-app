package main

import (
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvMaxReadyCount is the maximum number of readies acceptable before alerting
	EnvMaxReadyCount = `FLU_RABBIT_MAX_READY`

	// EnvMaxUnackedCount is the maximum number of unacked messages acceptable before
	// alerting
	EnvMaxUnackedCount = `FLU_RABBIT_MAX_UNACKED`

	// EnvAmqpQueueAddr is the address of the queue
	EnvAmqpQueueAddr = `FLU_AMQP_QUEUE_ADDR`

	// EnvRmqManagementUser is the username for the RMQ Management API
	EnvRmqManagementUser = `FLU_RMQ_MANAGEMENT_USER`

	// EnvRmqManagementPassword is the password for the RMQ Management API
	EnvRmqManagementPassword = `FLU_RMQ_MANAGEMENT_PASSWORD`
)

func main() {
	var (
		maxReadyCount_        = util.GetEnvOrFatal(EnvMaxReadyCount)
		maxUnackedCount_      = util.GetEnvOrFatal(EnvMaxUnackedCount)
		queueAddress          = util.GetEnvOrFatal(EnvAmqpQueueAddr)
		rmqManagementUser     = util.GetEnvOrFatal(EnvRmqManagementUser)
		rmqManagementPassword = util.GetEnvOrFatal(EnvRmqManagementPassword)
	)

	maxReadyCount, err := strconv.ParseUint(maxReadyCount_, 10, 32)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("ready count must be a uint (%v)!", maxReadyCount_)
			k.Payload = err
		})
	}

	maxUnackedCount, err := strconv.ParseUint(maxUnackedCount_, 10, 32)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("unacked count must be a uint (%v)!", maxUnackedCount_)
			k.Payload = err
		})
	}

	rmq := NewRmqManagementClient(queueAddress, rmqManagementUser, rmqManagementPassword)

	vhosts, err := rmq.getVhosts()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("could not retrieve Vhosts from RMQ Management (%v)!", queueAddress)
			k.Payload = err
		})
	}

	for _, vhost := range vhosts {
		queues, err := rmq.getRmqQueues(vhost.Name)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format("could not retrieve queues from RMQ Management (%v)!", queueAddress)
				k.Payload = err
			})
		}

		for _, queue := range queues {
			var (
				name            = queue.Name
				messagesReady   = queue.MessagesReady
				messagesUnacked = queue.MessagesUnacked
			)

			log.Debug(func(k *log.Log) {
				k.Format(
					"queue: %v has %v/%v Ready messages, and %v/%v Unacked messages",
					name,
					messagesReady,
					maxReadyCount,
					messagesUnacked,
					maxUnackedCount,
				)

			})

			if messagesReady > maxReadyCount {
				reportToDiscord(queue, "Ready", messagesReady, maxReadyCount)
			}

			if messagesUnacked > maxUnackedCount {
				reportToDiscord(queue, "Unacked", messagesUnacked, maxUnackedCount)
			}
		}

	}
}
