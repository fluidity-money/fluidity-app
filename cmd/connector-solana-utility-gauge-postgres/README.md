
# connector-solana-utility-gauge-postgres

connector-solana-utility-gauge-postgres listens to updates to the Utility Gauge program, and inserts current power shares into Postgres

## Environment variables

|                Name             |                              Description
| --------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                 | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                     | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_POSTGRES_URI`              | Database URI to use when connecting to the Postgres database.			     |
| `FLU_SOLANA_WS_URL`             | Solana node WS address.                                                      |

## Building

	make build

## Testing

	make test

## Docker

	make docker
