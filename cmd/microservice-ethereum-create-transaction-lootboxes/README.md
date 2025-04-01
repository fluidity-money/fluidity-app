# microservice-ethereum-create-transaction-lootboxes

Creates lootboxes from user actions tracked by the application server, ignoring non-applications.

## Environment variables

| Name                  | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| `FLU_WORKER_ID`       | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`           | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR` | AMQP queue address connected to to receive and send messages down.           |
| `FLU_TIMESCALE_URI`   | Database URI to use when connecting to the Timescale database.               |
| `FLU_ETHEREUM_TOKENS_LIST` | List of tokens in address:shortname:decimals form to look up addresses from a short name |
| `FLU_ETHEREUM_HTTP_URL` | URL to use to chat to an Ethereum RPC node. |

## Building

    make build

## Testing

    make test

## Docker

    make docker
