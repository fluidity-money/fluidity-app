
# Fluidity Solana Worker Server

This codebase contains the offchain worker implementation for Fluidity's
Solana deployment.

It takes transactions from Solana, scans for winning transactions, and
sends a message to the client with the winner randomness!

## Environment variables

|              Name               |                                  Description                                 |
|---------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                 | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_REDIS_ADDR`                | Redis address pointing to Redis for state tracking							 |
| `FLU_DEBUG`                     | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`           | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SOLANA_RPC_URL`            | Solana node RPC address.                                                     |
| `FLU_SOLANA_NETWORK`            | Solana network for TRF vars.                                                 |
| `FLU_SOLANA_FLUID_MINT_PUBKEY`  | Public key of the fluid token mint.                                          |
| `FLU_SOLANA_RESERVE_PUBKEY`     | Public key of the solend reserve account.                                    |
| `FLU_SOLANA_TOKEN_DECIMALS`     | Number of decimals token uses.                                               |
| `FLU_SOLANA_TOKEN_NAME`         | Name of the token being wrapped.                                             |
| `FLU_SOLANA_WINNER_QUEUE_NAME`  | Queue to transmit client topic of a winner.                                  |

## Building

	make build

## Building (Docker)

	make docker
