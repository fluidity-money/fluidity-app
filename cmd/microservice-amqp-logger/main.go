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
		fmt.Printf("%v: %v\n", topic, message.Content)
	})
}
