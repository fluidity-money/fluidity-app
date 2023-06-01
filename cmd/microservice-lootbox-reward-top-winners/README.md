
# microservice-lootbox-reward-top-winners

Cron-based service to pay out rewards for highly active users during the airdrop.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`              | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                  | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_TIMESCALE_URI`          | Timescale URI to use when writing user actions to the database.              |

## Building

    make build

## Testing

    make test

## Docker

    make docker
