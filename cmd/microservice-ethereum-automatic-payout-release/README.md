
# microservice-ethereum-automatic-payout-release

Runs in cron to automatically send batched rewards on a timer.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME`   | AMQP topic to send batched winner announcements down.      |
| `FLU_ETHEREUM_TOKENS_LIST`                      | Tokens to process. |

## Building

    make build

## Testing

    make test

## Docker

    make docker
