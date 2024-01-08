
# microservice-user-transactions-aggregate

Aggregates user actions and wins in Timescale to be displayed in the Fluidity webapp.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`              | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                  | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`        | AMQP queue address connected to to receive and send messages down.           |
| `FLU_TIMESCALE_URI`          | Database URI to use when connecting to the Timescale database.               |

## Building

    make build

## Testing

    make test

## Docker

    make docker
