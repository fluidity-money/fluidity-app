#!/bin/sh -e

websocketd \
	--passenv FLU_AMQP_QUEUE_ADDR,FLU_REDIS_ADDR \
	--port 9999 \
	./get-all-messages.sh
