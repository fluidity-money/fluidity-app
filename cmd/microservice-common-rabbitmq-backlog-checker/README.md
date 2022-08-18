
# AMQP Queue Backlog Alerter

Connects to AMQP management API and polls endpoints to get queue message
states. Sends alert to Discord if amount of "ready" or "unacknowledged"
messages exceeds given limits.

## Environment variables

|           Name           |                                  Description
|--------------------------|--------------------------------------------------------------------------------|
| `FLU_RABBIT_MAX_READY`   | Maximum number of readies acceptable before sending Discord alert				|
| `FLU_RABBIT_MAX_UNACKED` | Maximum number of unacks acceptable before sending Discord alert	            |
| `FLU_RABBIT_MAX_DEAD_LETTER` | Maximum number of dead letters acceptable before sending Discord alert		|
| `FLU_AMQP_USER` 		   | Username of RabbitMQ management user											|
| `FLU_AMQP_USER_PASS` 	   | Password of RabbitMQ management user											|
| `FLU_AMQP_QUEUE_ADDR`    | AMQP queue address connected to to receive and send messages down.           	|
| `FLU_REDIS_PASSWORD`     | Password to use when connecting to the Redis host.                           	|
| `FLU_DISCORD_WEBHOOK`      | Discord webhook to use when the Discord Notify function is used.             |

## Building

	make build

## Testing

	make test

## Docker

	make docker
