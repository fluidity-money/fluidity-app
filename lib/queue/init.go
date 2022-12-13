// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package queue

import (
	"os"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"

	amqp "github.com/rabbitmq/amqp091-go"
)

func init() {
	var (
		workerId = util.GetWorkerId()

		deadLetterEnabled = os.Getenv(EnvDeadLetterEnabled) != "false"

		messageRetries_ = util.GetEnvOrDefault(EnvMessageRetries, "5")

		goroutines_ = util.GetEnvOrDefault(EnvGoroutinesPerQueue, "1")

		queueAddr = util.GetEnvOrFatal(EnvQueueAddr)

		// testingEnabled to check if the environment is
		// currently in a state of testing
		testingEnabled = microservice_lib.IsTesting()

		// testMessages should be set if the user has elected to
		// enable testing with FLU_TESTING, otherwise if
		// FLU_TESTING is set the queue is not enabled in the
		// first place if it's accidentally loaded somewhere
		testMessages = os.Getenv(EnvTestMessages)
	)

	messageRetries, err := strconv.Atoi(messageRetries_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to set %#v: Can't convert '%#v' to an integer!",
				EnvMessageRetries,
				messageRetries_,
			)

			k.Payload = err
		})
	}

	goroutines, err := strconv.Atoi(goroutines_)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to parse the number of goroutines per queue %#v: Can't convert '%#v' to an integer!",
				EnvGoroutinesPerQueue,
				goroutines_,
			)

			k.Payload = err
		})
	}

	// if testing is enabled, send (some) phony information that's not set
	// (the handler will check for testing enabled and handle
	// properly) and if the file is given that includes fake messages to send
	// then read each message from the file and send it out

	// also buffer any outgoing messages to allow them to be requested
	// by any testing users, only recording them if they're not empty

	// will die if it fails to get any fake messages from the env

	if testingEnabled {

		testMessagesEnabled := testMessages != ""

		testMessagesOutgoing := make(chan Message, 0)

		if testMessagesEnabled {
			fakeMessages := getFakeMessages(testMessages)

			go func() {
				for _, fakeMessage := range fakeMessages {
					testMessagesOutgoing <- fakeMessage
				}
			}()
		}

		go func() {
			// sentMessages to buffer in a queue to send to
			// any clients that want them

			sentMessages := make([]string, 0)

			for {
				select {
				case message := <-chanDebugSentMessages:
					var (
						outgoing              = message.outgoing
						chanSentMessages = message.chanSentMessages
					)

					if outgoing != "" {
						sentMessages = append(sentMessages, outgoing)
					}

					if sentMessages != nil {
						chanSentMessages <- sentMessages
						sentMessages = make([]string, 0)
					}

				default:
					chanAmqpDetails <- amqpDetails{
						exchangeName:   ExchangeName,
						workerId:       workerId,
						messageRetries: messageRetries,
						goroutines:     goroutines,
						isTesting:      testingEnabled,
						testMessages:   testMessagesOutgoing,
					}
				}
			}
		}()

		return
	}

	// if testing is not enabled, set up the connection to the queue
	// and an error handler for unexpected closes, then the exchange
	// and a handler for any program shutdowns

	client, err := amqp.Dial(queueAddr)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to connect to AMQP server!"
			k.Payload = err
		})
	}

	channel, err := client.Channel()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to open a channel on AMQP!"
			k.Payload = err
		})
	}

	err = channel.ExchangeDeclare(
		ExchangeName,
		ExchangeType,
		true,  // durable
		false, // autoDelete,
		false, // internal
		false, // noWait
		nil,   // args
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to declare an exchange!"
			k.Payload = err
		})
	}

	log.Debugf(
		"Declared a queue with name %#v type %#v!",
		ExchangeName,
		ExchangeType,
	)

	log.RegisterShutdown(func() {
		_ = channel.Close()
	})

	go func() {
		errors := make(chan *amqp.Error)

		err, closed := <-channel.NotifyClose(errors)

		if closed && err == nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "AMQP closed on its own without an error!!!"
			})
		}

		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Channel to AMQP closed prematurely with error!"
			k.Payload = err
		})
	}()

	go func() {
		for {
			chanAmqpDetails <- amqpDetails{
				channel:           channel,
				exchangeName:      ExchangeName,
				workerId:          workerId,
				deadLetterEnabled: deadLetterEnabled,
				messageRetries:    messageRetries,
				goroutines:        goroutines,

				isTesting: testingEnabled,
			}
		}
	}()
}
