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

	// EnvMaxDeadLetterCount is the maximum number of messages in the dead letter queue
	// acceptable before alerting
	EnvMaxDeadLetterCount = `FLU_RABBIT_MAX_DEAD_LETTER`

	// EnvAmqpQueueAddr is the address of the queue
	EnvAmqpQueueAddr = `FLU_AMQP_QUEUE_ADDR`
)

func main() {
	var (
		maxReadyCount_      = util.GetEnvOrFatal(EnvMaxReadyCount)
		maxUnackedCount_    = util.GetEnvOrFatal(EnvMaxUnackedCount)
		maxDeadLetterCount_ = util.GetEnvOrFatal(EnvMaxDeadLetterCount)
		queueAddress        = util.GetEnvOrFatal(EnvAmqpQueueAddr)
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

	maxDeadLetterCount, err := strconv.ParseUint(maxDeadLetterCount_, 10, 32)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("dead letter count must be a uint (%v)!", maxDeadLetterCount_)
			k.Payload = err
		})
	}

	rmq := NewRmqManagementClient(queueAddress)

	vhosts, err := rmq.getVhosts()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Could not retrieve Vhosts from RMQ Management!"
			k.Payload = err
		})
	}

	for _, vhost := range vhosts {
		queues, err := rmq.getRmqQueues(vhost.Name)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "could not retrieve queues from RMQ Management!"
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

			switch isDeadLetterQueue(name) {
			case true:
				log.Debug(func(k *log.Log) {
					k.Format(
						"queue: %v is a dead letter queue! Using the message count limit of %v",
						name,
						maxDeadLetterCount,
					)
				})

				if messagesReady > maxDeadLetterCount {
					reportToDiscord(queue, "Dead Letter Ready", messagesReady, maxDeadLetterCount)
				}

				if messagesUnacked > maxDeadLetterCount {
					reportToDiscord(queue, "Dead Letter Unacked", messagesUnacked, maxDeadLetterCount)
				}
			case false:
				if messagesReady > maxReadyCount {
					reportToDiscord(queue, "Ready", messagesReady, maxReadyCount)
				}

				if messagesUnacked > maxUnackedCount {
					reportToDiscord(queue, "Unacked", messagesUnacked, maxUnackedCount)
				}
			}
		}
	}
}
