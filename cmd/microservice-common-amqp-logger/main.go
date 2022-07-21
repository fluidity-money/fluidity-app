// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package main

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

// EnvTopicSubscribe to use to get messages to print
const EnvTopicSubscribe = `FLU_AMQP_TOPIC_CONSUME`

func main() {
	topic := util.GetEnvOrFatal(EnvTopicSubscribe)

	queue.GetMessages(topic, func(message queue.Message) {
		fmt.Printf("%v: %v\n", message.Topic, message.Content)
	})
}
