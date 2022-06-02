
# Fluidity Ethereum Worker Client

This codebase contains the offchain worker implementation for Fluidity's
Ethereum deployment.

It takes messages relayed from microservice-ethereum-worker-server, scans for
winning transactions and relays to the spooler.

## Environment variables (Ethereum client)

|               Name                |                                  Description                                  |
|-----------------------------------|-------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                   | Worker ID used to identify the application in logging and to the AMQP queue.  |
| `FLU_DEBUG`                       | Toggle debug messages produced by any application using the debug logger.     |
| `FLU_AMQP_QUEUE_ADDR`             | AMQP queue address connected to to receive and send messages down.            |
| `FLU_ETHEREUM_AMQP_QUEUE_NAME`    | Queue name to receive messages from the server down.                          |
| `FLU_ETHEREUM_AMQP_PUBLISH_NAME`  | Queue name to send reward messages down.                                      |

## Building

	make build

## Building (Docker)

	make docker
