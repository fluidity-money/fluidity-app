# Common Lootboxes Timescale

Write Transaction Lootboxes to Timescale.

## Environment variables

| Name                  | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| `FLU_WORKER_ID`       | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`           | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR` | AMQP queue address connected to to receive and send messages down.           |
| `FLU_TIMESCALE_URI`   | Timescale URI to use when writing user actions to the database.              |

## Building

    make build

## Testing

    make test

## Docker

    make docker
