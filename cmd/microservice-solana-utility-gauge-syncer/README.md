
# microservice-solana-utility-gauge-syncer

Waits for Gauge epochs to end, and sends new epoch and whitelisted down AMQP.
Service then increments Gauge to start next epoch

## Environment variables

|            Name            |                                 Description                                        |
|----------------------------|------------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                       | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                           | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_SOLANA_RPC_URL`                  | Solana node RPC address to fetch transaction info from.                      |
| `FLU_SOLANA_GAUGEMEISTER_PUBKEY`      | Public key of Gaugemeister                                                   |
| `FLU_UTILITY_GAUGE_PROGRAM_ID`        | Program address of Utility Gauge                                             |
| `FLU_SOLANA_UTILITY_GAUGE_SECRET_KEY` | Secret key of executor (base58)                                              |

## Building

	make build

## Testing

	make test

## Docker

	make docker
