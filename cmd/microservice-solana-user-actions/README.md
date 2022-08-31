
# microservice-user-actions

Reads transactions from the Solana AMQP, determines when swaps / trades
occured, and puts that result down AMQP.

Also tracks winners and sends their results down the queue.

## Environment variables

|              Name              |                              Description
|--------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                    | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`          | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SOLANA_PROGRAM_ID`        | Program ID for the onchain fluidity program.                                 |
| `FLU_SOLANA_FLUID_MINT_PUBKEY` | Public key for the fluid token mint authority.                               |
| `FLU_SOLANA_PDA_PUBKEY`        | Public key for the fluidity program's associated account.                    |

## Building

	make build

## Testing

	make test

## Docker

	make docker
