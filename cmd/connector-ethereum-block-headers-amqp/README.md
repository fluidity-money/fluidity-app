
# Connector Block Headers to AMQP

Subscribes to NewHeads and sends headers down AMQP.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`              | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                  | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_SENTRY_URL`             | String that may be optionally set with a Sentry URL to log app.              |
| `FLU_AMQP_QUEUE_ADDR`        | AMQP queue address connected to to receive and send messages down.           |
| `FLU_ETHEREUM_WS_URL`        | Geth websocket address to use to receive Ethereum Heads from                 |

## Building

	make build

## Testing

	make test

## Docker

	make docker
