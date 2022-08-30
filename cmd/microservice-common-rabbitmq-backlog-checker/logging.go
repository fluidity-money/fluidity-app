// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"fmt"
	"io"
	"net/url"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/discord"
	"github.com/rabbitmq/amqp091-go"
)

type message struct {
	message string
	content string
}

func reportToDiscord(message string, arguments ...interface{}) {
	discord.Notify(
		0,
		message,
		arguments...,
	)
}

func reportToDiscordWithAttachment(message string, content map[string]io.Reader) {
	discord.NotifyWithAttachment(0, message, content)
}

// queueReport to put messages into the channel, so that they can be batch processed
func queueReport(messageChan chan string, queue rmqQueue, messageType string, numMessages uint64, limitMessages uint64) {
	messageChan <- fmt.Sprintf(
		"Queue %v has too many %v messages (%v, limit: %v) Node %v/%v is %v\n",
		queue.Name,
		messageType,
		numMessages,
		limitMessages,
		queue.Vhost,
		queue.Node,
		queue.State,
	)
}

// queueReportWithMessage to put messages into the channel, so that they can be batch processed, including the message body in the log
func queueReportWithMessage(messageAttachmentsChan chan message, queue rmqQueue, messageType string, numMessages uint64, limitMessages uint64, messageJson string) {
	messageAttachmentsChan <- message{
		message: fmt.Sprintf(
			"Queue %v has too many %v messages (%v, limit: %v) Node %v/%v is %v.\n",
			queue.Name,
			messageType,
			numMessages,
			limitMessages,
			queue.Vhost,
			queue.Node,
			queue.State,
		),

		content: messageJson,
	}
}

// getAndRequeueFirstMessage to `Nack message requeue true` the first message in a queue
func getAndRequeueFirstMessage(queueAddress, queueName, vhost string) (string, error) {
	// parse the http[s] URL into an amqp[s] URL
	url, err := url.Parse(queueAddress)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse AMQP URL!"
			k.Payload = err
		})
	}

	// switch the schema to amqp[s]
	switch url.Scheme {
	case "http":
		url.Scheme = "amqp"
	case "https":
		url.Scheme = "amqps"
	default:
		return "", fmt.Errorf(
			"AMQP URI had an unexpected scheme %v!",
			url.Scheme,
		)
	}

	config := amqp091.Config{Vhost: vhost}
	client, err := amqp091.DialConfig(url.String(), config)

	if err != nil {
		return "", fmt.Errorf(
			"Failed to connect client to AMQP! %v",
			err,
		)
	}

	defer client.Close()

	amqpChannel, err := client.Channel()

	if err != nil {
		return "", fmt.Errorf(
			"Failed to open channel! %v",
			err,
		)
	}

	// get the message to be requeued
	msg, ok, err := amqpChannel.Get(queueName, false)

	if err != nil {
		return "", fmt.Errorf(
			"Failed to get a message from the channel! %v",
			err,
		)
	}

	// if we failed to get a message without an error, the queue was probably emptied during execution of this function, so simply exit early
	if !ok {
		log.App(func(k *log.Log) {
			k.Format(
				"Message Get for queue %v was not 'ok'! The message was probably already acked - skipping!",
				queueName,
			)
		})
		return "", nil
	}

	defer msg.Nack(false, true)

	return string(msg.Body), nil
}
