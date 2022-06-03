
# microservice-ethereum-transaction-spooler

Caches rewards until a reward with high enough value, or the total value
of unpaid rewards is high enough.

## Environment variables

|                       Name                       |                           Description
|--------------------------------------------------|------------------------------------------------------------|
| `FLU_ETHEREUM_WINNERS_AMQP_QUEUE_NAME`           | AMQP topic to receive winner announcements from.           |
| `FLU_ETHEREUM_BATCHED_WINNERS_AMQP_QUEUE_NAME`   | AMQP topic to send batched winner announcements down.      |
| `FLU_ETHEREUM_SPOOLER_INSTANT_REWARD_THRESHOLD` | Amount a reward can be before being sent instantly.        |
| `FLU_ETHEREUM_SPOOLER_TOTAL_REWARD_THRESHOLD`   | Amount of total unpaid rewards that can accumulate.        |

## Building

    make build

## Testing

    make test

## Docker

    make docker
