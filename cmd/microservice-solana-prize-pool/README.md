
# microservice-solana-prize-pool

Tracks the current state of the prize pool by querying the state of the contract each block.

## Environment variables

|                 Name                |                              Description
| ------------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                     | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                         | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`               | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SOLANA_RPC_URL`                | Solana node RPC address.                                                     |
| `FLU_SOLANA_PRIZE_POOL_UPDATE_TIME` | Duration string to get prize pool updates on.                                |
| `FLU_SOLANA_PROGRAM_ID`             | Program ID of the fluidity program.                                          |
| `FLU_SOLANA_FLUID_MINT_PUBKEY`      | Public key of the fluid token mint.                                          |
| `FLU_SOLANA_TVL_DATA_PUBKEY`        | Public key of an initialized account to store TVL data.                      |
| `FLU_SOLANA_SOLEND_PUBKEY`          | Program ID of the solend program.                                            |
| `FLU_SOLANA_OBLIGATION_PUBKEY`      | Public key of the solend obligation account.                                 |
| `FLU_SOLANA_RESERVE_PUBKEY`         | Public key of the solend reserve account.                                    |
| `FLU_SOLANA_PYTH_PUBKEY`            | Public key of the solend pyth account.                                       |
| `FLU_SOLANA_SWITCHBOARD_PUBKEY`     | Public key of the solend switchboard account.                                |
| `FLU_SOLANA_TVL_PAYER_PRIKEY`       | Private key with some sol, won't be spent from.                              |

## Building

	make build

## Testing

	make test

## Docker

	make docker
