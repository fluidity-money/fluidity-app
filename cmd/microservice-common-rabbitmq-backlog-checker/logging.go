package main

import (
	discord "github.com/fluidity-money/fluidity-app/lib/log/discord"
)

func reportToDiscord(queue rmqQueue, messageType string, numMessages uint64, limitMessages uint64) {
	discord.Notify(
		0,
		"Queue %v has too many %v messages (%v, limit: %v) Node %v/%v is %v",
		queue.Name,
		messageType,
		numMessages,
		limitMessages,
		queue.Vhost,
		queue.Node,
		queue.State,
	)
}
