#!/bin/sh

export FLU_AMQP_QUEUE_ADDR="amqp://fluidity:fluidity@127.0.0.1"

./drain-queue.sh "microservice-amqp-logger" "#"
