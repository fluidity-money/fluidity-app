
# Microservice Fluidity Fanfare

Broadcasts user actions and winners on the internal queue via
websocket when users request it.

## Environment variables

|          Name          |                                 Description
|------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`        | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`            | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`  | AMQP queue address connected to to receive and send messages down.           |
| `FLU_ETHEREUM_NETWORK` | Network in use ("ethereum" or "arbitrum").                                   |
| `FLU_WEB_LISTEN_ADDR`  | Address to listen on for the websocket (ie ":8080")                          |

## Building

	make build

## Testing

	make test

## Docker

	make docker
