#!/bin/sh

worker_id="$1"
queue_name="$2"

[ -z "$worker_id" ] && exit 1

[ -z "$queue_name" ] && exit 1

export FLU_AMQP_QUEUE_ADDR="${FLU_AMQP_QUEUE_ADDR:-amqp://127.0.0.1}"

export \
	FLU_AMQP_TOPIC_CONSUME="$queue_name" \
	FLU_WORKER_ID="$worker_id"

./microservice-common-amqp-logger.out
