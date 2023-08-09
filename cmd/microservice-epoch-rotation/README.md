# microservice-epoch-rotation

Cron-based service to create new epoch window for tracking user actions
Epoch duration is randomly nudged

## Environment variables

| Name                            | Description                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `FLU_WORKER_ID`                 | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                     | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_TIMESCALE_URI`             | Timescale URI to use when writing user actions to the database.              |
| `FLU_RANDOM_ORG_SECRET`         | Random.org secret API key                                                    |
| `FLU_REWARD_EPOCH_MEAN_DAYS`    | Mean days epoch is expected to go on for.                                    |
| `FLU_REWARD_EPOCH_APPLICATIONS` | Epoch Applications to be tracked. Should be changed before service is run    |

## Building

    make build

## Testing

    make test

## Docker

    make docker
