
# Prize pool to Postgres connector

Reads prize pool messages and updates the Postgres database with the latest.

## Environment variables

|           Name           |                              Description
|--------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`              | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_POSTGRES_URI`       | Database URI to use when connecting to the Postgres database.                |

## Building

	make build

## Testing

	make test

## Docker

	make docker
