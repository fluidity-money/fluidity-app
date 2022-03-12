
# AMQP Test Consumer

Takes messages from `FLU_TOPIC_CONSUME` and print in its literal form
to stdout.

## Environment variables

|           Name           |                              Description
|--------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`              | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`    | AMQP queue address connected to to receive and send messages down.           |
| `FLU_AMQP_EXCHANGE_NAME` | The AMQP exchange name that's connected to.                                  |
| `FLU_AMQP_EXCHANGE_TYPE` | The AMQP exchange type.                                                      |
| `FLU_AMQP_TOPIC_CONSUME` | Topic to consume AMQP messages on!                                           |


## Building

	make build

## Testing

	make test

## Docker

	make docker
