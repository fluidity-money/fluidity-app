
# Ethlogs to AMQP connector

Simply writes the latest Ethereum logs from a block height to AMQP. Will
stream every log for 2000 blocks from the height designated in the Redis
key "ethereum.logs.latest-block" then die.

## Environment variables

|            Name            |                              Description
|----------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`            | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`      | AMQP queue address connected to to receive and send messages down.           |
| `FLU_ETHEREUM_WS_URL`      | Geth websocket address to use to receive Ethereum logs from.                 |
| `FLU_ETHEREUM_START_BLOCK` | Start collecting from this block height.                                     |

### `FLU_ETHEREUM_START_BLOCK`

If set to `""`, then Redis will be used to determine the height to read
from at the appropriate key. If set to `latest`, then the latest block
will be used. If set to a number, that block height will be read from
initially.

## Building

	make build

## Testing

	make test

## Docker

	make docker
