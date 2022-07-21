// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

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
