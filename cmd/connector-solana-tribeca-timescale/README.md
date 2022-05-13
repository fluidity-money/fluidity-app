
# connector-solana-tribeca-timescale

connector-solana-tribeca-timescale listens to updates to data accounts owned by a program, and inserts updates into Timescale

## Environment variables

|                Name             |                              Description
| --------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                 | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                     | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_TIMESCALE_URI`             | Database URI to use when connecting to the Timescale database.               |
| `FLU_SOLANA_WS_URL`             | Solana node WS address.                                                      |
| `FLU_TRIBECA_PROGRAM_ID`	      | Program ID of the program Tribeca controls.                                  |

## Building

	make build

## Testing

	make test

## Docker

	make docker
