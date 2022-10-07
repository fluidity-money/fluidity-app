#!/bin/sh

export FLU_AMQP_QUEUE_ADDR=amqp://localhost:5672
export FLU_WORKER_ID=abc
export FLU_REDIS_ADDR=localhost:6379

if ! pgrep -x "rabbitmq-server" > /dev/null
then
    echo "Requires rabbitmq-server to be running locally on port 5672!"
    exit 1
fi

if ! pgrep -x "redis-server" > /dev/null
then
    echo "Requires redis-server to be running locally on port 6379!"
    exit 1
fi

go test ./...
