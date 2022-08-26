// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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

	messageChan := make(chan string)
	done := make(chan bool)

	// get reports from the channel and concat them together,
	// then report to discord once the channel is closed
	go func() {
		var reportBody string
		for {
			message, more := <-messageChan

			if more {
				reportBody += message
			} else {
				if reportBody != "" {
					reportToDiscord(reportBody)
				}

				done <- true
				return
			}
		}
	}()

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

				if messagesUnacked > maxDeadLetterCount {
					queueReport(
						messageChan,
						queue,
						"Dead Letter Unacked",
						messagesUnacked,
						maxDeadLetterCount,
					)
				}

				// if there's any messages on the queue, obtain the first to be logged
				if messagesReady == 0 {
					break
				}

				msg, err := getAndRequeueFirstMessage(rmq.rmqAddress, name, vhost.Name)

				if err != nil {
					log.Fatal(func(k *log.Log) {
						k.Message = "Failed to get the top dead letter queue message!"
						k.Payload = err
					})
				}

				if len(msg) > 0 && messagesReady > maxDeadLetterCount {
					queueReportWithMessage(
						messageChan,
						queue,
						"Dead Letter Ready",
						messagesReady,
						maxDeadLetterCount,
						msg,
					)
				}

			case false:
				if messagesReady > maxReadyCount {
					queueReport(
						messageChan,
						queue,
						"Ready",
						messagesReady,
						maxReadyCount,
					)
				}

				if messagesUnacked > maxUnackedCount {
					queueReport(
						messageChan,
						queue,
						"Unacked",
						messagesUnacked,
						maxUnackedCount,
					)
				}
			}
		}
	}

	// signal that we're done, and send the message to discord
	close(messageChan)
	<-done
}
