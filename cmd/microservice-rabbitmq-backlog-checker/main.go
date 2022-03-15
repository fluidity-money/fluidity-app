package main

import (
	"strconv"

	lib "github.com/fluidity-money/fluidity-app/cmd/microservice-rabbitmq-backlog-checker/lib"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvMaxReadyCount is the maximum number of readies acceptable before alerting
	EnvMaxReadyCount = `FLU_MAX_READY`

	// EnvMaxUnackedCount is the maximum number of unacked messages acceptable before alerting
	EnvMaxUnackedCount = `FLU_MAX_UNACKED`

	// EnvAmqpQueueAddr is the address of the queue
	EnvAmqpQueueAddr = `FLU_AMQP_QUEUE_ADDR`

	// EnvRmqUser is a user of the RabbitMQ management API
	EnvRmqUser = `FLU_AMQP_USER`

	// EnvRmqUserPass is the EnvRmqUser user's password
	EnvRmqUserPass = `FLU_AMQP_USER_PASS`
)

func main() {
	var (
		maxReadyCount_   = util.GetEnvOrFatal(EnvMaxReadyCount)
		maxUnackedCount_ = util.GetEnvOrFatal(EnvMaxUnackedCount)
		queueAddress     = util.GetEnvOrFatal(EnvAmqpQueueAddr)
		rmqUsername      = util.GetEnvOrFatal(EnvRmqUser)
		rmqPassword      = util.GetEnvOrFatal(EnvRmqUserPass)
	)

	maxReadyCount, err := strconv.ParseUint(maxReadyCount_, 10, 32)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("Ready count must be a uint (%v)!", maxReadyCount_)
			k.Payload = err
		})
	}

	maxUnackedCount, err := strconv.ParseUint(maxUnackedCount_, 10, 32)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("Unacked count must be a uint (%v)!", maxUnackedCount_)
			k.Payload = err
		})
	}

	queues := lib.GetRmqQueues(queueAddress, rmqUsername, rmqPassword)

	for _, queue := range queues {
		if queue.MessagesReady > maxReadyCount {
			reportToSlack(queue, "Ready", queue.MessagesReady, maxReadyCount)
		}

		if queue.MessagedUnacked > maxUnackedCount {
			reportToSlack(queue, "Unacked", queue.MessagedUnacked, maxUnackedCount)
		}
	}

}
