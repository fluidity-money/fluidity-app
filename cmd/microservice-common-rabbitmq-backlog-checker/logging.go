package main

import (
	"github.com/fluidity-money/fluidity-app/lib/log/slack"
)

func reportToSlack(queue rmqQueue, messageType string, numMessages uint64, limitMessages uint64) {
	slack.Notify(
		slack.ChannelProductionFailures,
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
