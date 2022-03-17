package main

import (
	lib "github.com/fluidity-money/fluidity-app/cmd/microservice-common-rabbitmq-backlog-checker/lib"
	"github.com/fluidity-money/fluidity-app/lib/log/slack"
)

func reportToSlack(queue lib.RmqQueue, messageType string, numMessages uint64, limitMessages uint64) {
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
