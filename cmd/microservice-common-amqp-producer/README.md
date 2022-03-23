
# AMQP Stdin Producer

Simply takes lines from stdin and publishes with the queue as an
environment variable.


## Environment variables

|           Name           |                              Description
|--------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`              | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`    | AMQP queue address connected to to receive and send messages down.           |
| `FLU_AMQP_TOPIC_PUBLISH` | Topic to publish lines read from STDIN on.                                   |

## Building

	make build

## Testing

	make test

## Docker

	make docker
