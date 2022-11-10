// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package queue

import (
	"os"
	"strconv"

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
		for {
			chanAmqpDetails <- amqpDetails{
				channel:           channel,
				exchangeName:      ExchangeName,
				workerId:          workerId,
				deadLetterEnabled: deadLetterEnabled,
				messageRetries:    messageRetries,
				goroutines:        goroutines,
			}
		}
	}()
}
