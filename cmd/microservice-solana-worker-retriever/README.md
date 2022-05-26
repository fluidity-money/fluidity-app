
# Fluidity Solana Worker Retriever

This codebase fetches transactions from Solana, and appends Pyth price
data to the transaction

It then sends the information onto the worker to calculate winners

## Environment variables

|              Name               |                                  Description                                 |
|---------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                 | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_REDIS_ADDR`                | Redis address pointing to Redis for state tracking							 |
| `FLU_DEBUG`                     | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`           | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SOLANA_RPC_URL`            | Solana node RPC address.                                                     |
| `FLU_SOLANA_PROGRAM_ID`         | Program ID of the fluidity program.                                          |
| `FLU_SOLANA_FLUID_MINT_PUBKEY`  | Public key of the fluid token mint.                                          |
| `FLU_SOLANA_TVL_DATA_PUBKEY`    | Public key of an initialized account to store TVL data.                      |
| `FLU_SOLANA_SOLEND_PROGRAM_ID`  | Program ID of the solend program.                                            |
| `FLU_SOLANA_OBLIGATION_PUBKEY`  | Public key of the solend obligation account.                                 |
| `FLU_SOLANA_RESERVE_PUBKEY`     | Public key of the solend reserve account.                                    |
| `FLU_SOLANA_PYTH_PUBKEY`        | Public key of the solend pyth account.                                       |
| `FLU_SOLANA_SWITCHBOARD_PUBKEY` | Public key of the solend switchboard account.                                |
| `FLU_SOLANA_PAYER_PRIKEY`       | Private key of the payout authority (base58)                                 |

## Building

	make build

## Building (Docker)

	make docker
