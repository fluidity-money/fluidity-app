
# Fluidity Geth Connector

Relays every transaction and block polled off Geth down AMQP.

## Environment variables

|           Name           |                              Description
|--------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_AMQP_QUEUE_ADDR`    | AMQP queue address connected to to receive and send messages down.           |
| `FLU_DEBUG`              | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_ETHEREUM_WS_URL`    | Websocket URI to connect to to connect to Geth.                              |

## Building

	make build

## Testing

	make test

## Docker

	make docker
