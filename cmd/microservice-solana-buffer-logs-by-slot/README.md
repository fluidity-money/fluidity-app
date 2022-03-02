
# Solana buffer logs by slot microservice

This microservice receives Solana logs from the queue and starts to
aggregate them in an arena in memory, storing them until the slot count
increments, sending them out after down a new queue with buffered logs.

## Environment variables

|         Name          |                              Description
|-----------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`       | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`           | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_SENTRY_URL`      | String that may be optionally set with a Sentry URL to log app.              |
| `FLU_AMQP_QUEUE_ADDR` | AMQP queue address connected to to receive and send messages down.           |

## Building

	make build

## Testing

	make test

## Docker

	make docker
