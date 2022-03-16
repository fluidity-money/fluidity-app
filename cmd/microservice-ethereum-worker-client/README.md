
# Fluidity Ethereum Worker Client

This codebase contains the offchain worker implementation for Fluidity's
Ethereum deployment.

It takes messages relayed from microservice-ethereum-worker-server, scans for
winning transactions, and calls the reward contract when a winner is seen.

## Environment variables (Ethereum client)

|               Name                |                                  Description                                  |
|-----------------------------------|-------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                   | Worker ID used to identify the application in logging and to the AMQP queue.  |
| `FLU_REDIS_ADDR`                  | Someone might actually have to explain this to me (breadcrumb?)               |
| `FLU_DEBUG`                       | Toggle debug messages produced by any application using the debug logger.     |
| `FLU_AMQP_QUEUE_ADDR`             | AMQP queue address connected to to receive and send messages down.            |
| `FLU_ETHEREUM_HTTP_URL`           | URL to use to chat to an Ethereum RPC node.                                   |
| `FLU_ETHEREUM_WORKER_PRIVATE_KEY` | Private key to use to sign transfers paying out users.                        |
| `FLU_ETHEREUM_GAS_LIMIT`          | Gas limit to use on bad chains. Should be used on Ropsten with `8000000`.     |
| `FLU_ETHEREUM_HARDHAT_FIX`        | If set to true, then a fix should be used to use the last block's gas limit.  |
| `FLU_ETHEREUM_AMQP_QUEUE_NAME`    | Queue name to receive messages from the server down.                          |

## Building

	make build

## Building (Docker)

	make docker
