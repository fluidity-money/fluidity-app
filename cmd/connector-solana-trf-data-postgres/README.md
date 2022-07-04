
# connector-solana-trf-data-postgres

connector-solana-trf-data-postgres listens to updates to the TRF data account, and inserts updates into Postgres

## Environment variables

|                Name             |                              Description
| --------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                 | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                     | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_POSTGRES_URI`              | Database URI to use when connecting to the Postgres database.                |
| `FLU_SOLANA_WS_URL`             | Solana node WS address.                                                      |
| `FLU_TRF_DATA_STORE_PROGRAM_ID` | Public key of the TRF data store program.                                    |

## Building

	make build

## Testing

	make test

## Docker

	make docker
