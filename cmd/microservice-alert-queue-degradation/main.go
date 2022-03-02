package main

import (
	"net/url"
	"fmt"
	"time"
	"strings"

	"github.com/fluidity-money/microservice-alert-queue-degradation/lib"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvFluAmqpQueueADdr to use to get the address of the queue to query
	EnvFluAmqpQueueAddr = "FLU_AMQP_QUEUE_ADDR"

	// PollTime to wait before checking on each queue ready messages
	PollTime = 10 * time.Minute
)

func main() {
	queueAddress := util.GetEnvOrFatal(EnvFluAmqpQueueAddr)

	queueUrl, err := url.Parse(queueAddress)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to parse the queue address URL!"
			k.Payload = err
		})
	}

	queueUrl.Scheme = "http"

	if port := queueUrl.Port(); port != "" {
		queueUrl.Host = strings.Replace(queueUrl.Host, ":"+port, "", 1)
	}

	queueUrl.Host += ":5672"

	for {
		pollBytes := states.GetSet(RedisKey, PollTime)

		queues, err := microservice_alert_queue_degradation.GetQueues(queueUrl)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to get queue information!"
				k.Payload = err
			})
		}
	}
}
