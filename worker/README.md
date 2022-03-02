
# Fluidity Worker

Fluidity is a stablecoin for people who can’t afford to leave their
money idle generating interest. **Fluidity rewards users when they actually
use it**.

This codebase contains the offchain worker implementation for Fluidity.

It takes messages relayed from the upstream server operated by Fluidity
fluidity-random, scans for winning transactions and calls the contract
when a winner is seen with the transaction and a merkle proof.

The repo contains multiple backends all in Go:

  - Ethereum
  - Solana

Refer to [HACKING.md](HACKING.md) for getting started on contributing!

## Environment Variables (Solana)
​
| Name                            | Description                                                                  |
|---------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                 | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_REDIS_ADDR`                | Someone might actually have to explain this to me (breadcrumb?)              |
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
| `FLU_SOLANA_PDA_PUBKEY`         | Public key of the fluidity contract's PDA for the token (USDC)               |
| `FLU_SOLANA_PAYER_PRIKEY`       | Private key of the payout authority (base58)                                 |

## Prerequisites

-

## Building

	make build

## Building (Docker)

	make docker
