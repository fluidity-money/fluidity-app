#!/bin/sh

\
	FLU_WORKER_ID=microservice-amqp-logger \
	FLU_AMQP_QUEUE_ADDR=amqp://fluidity:fluidity@127.0.0.1 \
	FLU_AMQP_TOPIC_CONSUME='#' \
	./microservice-amqp-logger.o
