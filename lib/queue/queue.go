// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package queue

// queue implements code that talks to RabbitMQ over AMQP.

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// Context is used to identify the AMQP server in logging
	Context = "AMQP"

	// ExchangeName to use for AMQP queues
	ExchangeName = `fluidity`

	// ExchangeType to use for routing messages inside the queue
	ExchangeType = `topic`

	// EnvQueueAddr is the address to access RabbitMQ.
	EnvQueueAddr = `FLU_AMQP_QUEUE_ADDR`

	// EnvDeadLetterEnabled to disable the use of dead letter queues
	// (disabling with "false" implies disabling retries)
	EnvDeadLetterEnabled = `FLU_AMQP_QUEUE_DEAD_LETTER_ENABLED`

	// EnvMessageRetries to attempt until giving up - defaults to
	// 5 if not set!
	EnvMessageRetries = `FLU_AMQP_QUEUE_MESSAGE_RETRIES`
)

type Message struct {
	Topic   string    `json:"topic"`
	Content io.Reader `json:"content"`
}

func (message Message) Decode(decoded interface{}) {
	// We decode everything that we receive as JSON.

	content := message.Content

	err := json.NewDecoder(content).Decode(decoded)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode a JSON message!"
			k.Payload = err
		})
	}

	log.Debugf("Successfully decoded a message from JSON!")
}

// GetMessages from the AMQP server, calling the function each time a
// message is received. If newTopic is set to true, a new queue name
// will be generated that will make this useful for receiving messages
// that would be received over broadcast that is unique to this worker.
// If it is set to false, every message that would be received is
// distributed across any worker sharing the same worker id.
func GetMessages(topic string, f func(message Message)) {

	amqpDetails := <-chanAmqpDetails

	var (
		channel           = amqpDetails.channel
		exchangeName      = amqpDetails.exchangeName
		workerId          = amqpDetails.workerId
		deadLetterEnabled = amqpDetails.deadLetterEnabled
		messageRetries    = amqpDetails.messageRetries
	)

	var (
		consumerId = generateRandomConsumerId(workerId)
		queueName  = fmt.Sprintf("%v.%v", topic, workerId)
	)

	messages, err := queueConsume(
		queueName,
		topic,
		exchangeName,
		consumerId,
		channel,
		deadLetterEnabled,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to start to consume queue %#v topic %#v, consumer id %#v, exchange %#v!",
				queueName,
				topic,
				consumerId,
				exchangeName,
			)

			k.Payload = err
		})
	}

	for message := range messages {
		var (
			deliveryTag = message.DeliveryTag
			body        = message.Body
			routingKey  = message.RoutingKey
		)

		bodyBuf := bytes.NewBuffer(body)

		// Risk of a collision is near 0 enough to be ignored.

		retryKey := fmt.Sprintf(
			"worker.%#v.retry.%#v.%#v",
			workerId,
			topic,
			util.GetB16Hash(body),
		)

		if deadLetterEnabled {
			retryCount := state.Incr(retryKey)

			state.Expire(retryKey, 86400) // 24 hours

			// the number of retries exceeds the max retry count! giving up!

			if int(retryCount) >= messageRetries {

				queueNackDeliveryTag(channel, deliveryTag)

				state.Del(retryKey)

				continue
			}
		}

		f(Message{
			Topic:   routingKey,
			Content: bodyBuf,
		})

		log.Debugf(
			"Asking the server to ack the receipt of %v!",
			deliveryTag,
		)

		if err := queueAckDeliveryTag(channel, deliveryTag); err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to ack a message with tag %#v!",
					deliveryTag,
				)

				k.Payload = err
			})
		}

		log.Debugf(
			"Server acked the reply for %v!",
			deliveryTag,
		)

		// clean up the retry key

		if deadLetterEnabled {
			state.Del(retryKey)
		}
	}
}

// SendMessage down a topic, with the JSON form of the content.
func SendMessage(topic string, content interface{}) {
	contentBytes, err := json.Marshal(content)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to encode a JSON structure!"
			k.Payload = err
		})
	}

	SendMessageBytes(topic, contentBytes)
}

// SendMessageBytes down a topic, with bytes as content
func SendMessageBytes(topic string, content []byte) {
	log.Debugf("Starting to send a publish request to the sending goroutine.")

	amqpDetails := <-chanAmqpDetails

	var (
		channel      = amqpDetails.channel
		exchangeName = amqpDetails.exchangeName
	)

	err := queuePublish(topic, exchangeName, content, channel)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to publish to the queue with topic %#v, exchange %#v! Error %#v",
				topic,
				exchangeName,
				err,
			)

			k.Payload = string(content)
		})
	}

	log.Debugf("Sending goroutine has received the request!")
}

// Finish up, by clearing the buffer
func Finish() {
	amqpDetails := <-chanAmqpDetails
	amqpDetails.channel.Close()
}
