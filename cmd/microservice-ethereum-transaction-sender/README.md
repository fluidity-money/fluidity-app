
# microservice-ethereum-transaction-sender

Receives batched transactions from AMQP and calls the reward function
on chain.

## Environment variables

|               Name                |                                  Description
|-----------------------------------|-------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                   | Worker ID used to identify the application in logging and to the AMQP queue.  |
| `FLU_DEBUG`                       | Toggle debug messages produced by any application using the debug logger.     |
| `FLU_AMQP_QUEUE_ADDR`             | AMQP queue address connected to to receive and send messages down.            |
| `FLU_ETHEREUM_CONTRACT_ADDR`      | Address of the ethereum contract to call.                                     |
| `FLU_ETHEREUM_HTTP_URL`           | URL to use to chat to an Ethereum RPC node.                                   |
| `FLU_ETHEREUM_WORKER_PRIVATE_KEY` | Private key to use to sign transfers paying out users.                        |
| `FLU_ETHEREUM_GAS_LIMIT`          | Gas limit to use on bad chains. Should be used on Ropsten with `8000000`.     |
| `FLU_ETHEREUM_HARDHAT_FIX`        | If set to true, then a fix should be used to use the last block's gas limit.  |
| `FLU_ETHEREUM_AMQP_QUEUE_NAME`    | Queue name to receive messages from the server down.                          |

## Building

    make build

## Testing

    make test

## Docker

    make docker
