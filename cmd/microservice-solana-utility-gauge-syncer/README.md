
# microservice-solana-utility-gauge-syncer

Waits for Gauge epochs to end, and sends new epoch and whitelisted down AMQP.
Service then increments Gauge to start next epoch

## Environment variables

|            Name            |                                 Description
|----------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                  | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                      | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`            | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SOLANA_RPC_URL`             | Solana node RPC address to fetch transaction info from.                      |
| `FLU_SOLANA_GAUGEMEISTER_PUBKEY` | Public key of Gaugemeister                                                   |

## Building

	make build

## Testing

	make test

## Docker

	make docker
