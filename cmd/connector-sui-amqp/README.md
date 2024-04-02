
# connector-sui-amqp

An all-in-one connector for reading events from the Sui blockchain to be processed by the worker and database infrastructure. Assumes only a single instance running at a time, and uses a single Redis "last seen checkpoint" key as opposed to Solana's multi-websocket design requiring synchronisation to avoid duplicating slots.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_SUI_HTTP_URL`                     | URL of the Sui RPC Websocket for event subscription.               |
| `FLU_SUI_FIRST_CHECKPOINT`             | Number of the checkpoint to start watching from.                   |
| `FLU_SUI_PAGINATION_WAIT_TIME_SECONDS` | Time to wait for new checkpoints to be added, in seconds.          |

## Building

    make build

## Testing

    make test

## Docker

    make docker
