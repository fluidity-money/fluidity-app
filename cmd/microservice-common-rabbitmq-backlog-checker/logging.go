package main

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log/discord"
)

func reportToDiscord(message string, arguments ...interface{}) {
	discord.Notify(
		0,
		message,
		arguments...,
	)
}

// queueMessage to put messages into the channel, so that they can be batch processed
func queueMessage(messageChan chan string, queue rmqQueue, messageType string, numMessages uint64, limitMessages uint64) {
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
