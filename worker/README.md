
# Fluidity Worker

This codebase contains the offchain worker implementation for Fluidity.

It takes messages relayed from the upstream server operated by Fluidity
fluidity-random, scans for winning transactions and calls the contract
when a winner is seen with the transaction and a merkle proof.

The repo contains multiple backends all in Go:

  - Ethereum
  - Solana

Refer to [HACKING.md](HACKING.md) for getting started on contributing!

## Environment variables (Ethereum server)

|                    Name                    |                                  Description                                  |
|--------------------------------------------|-------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                            | Worker ID used to identify the application in logging and to the AMQP queue.  |
| `FLU_REDIS_ADDR`                           | Someone might actually have to explain this to me (breadcrumb?)               |
| `FLU_DEBUG`                                | Toggle debug messages produced by any application using the debug logger.     |
| `FLU_AMQP_QUEUE_ADDR`                      | AMQP queue address connected to to receive and send messages down.            |
| `FLU_ETHEREUM_CONTRACT_ADDR`               | The contract address to use based on the backend for rewarding users.         |
| `FLU_ETHEREUM_HTTP_URL`                    | HTTP address to use to connect to Geth.                                       |
| `FLU_ETHEREUM_TOKEN_BACKEND`               | Token backend to use. (compound|aave).                                        |
| `FLU_ETHEREUM_CTOKEN_ADDR`                 | Address of the corresponding CToken (ie, cUSDT)                               |
| `FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR`  | Address of the Uniswap anchored view price oracle.                            |
| `FLU_ETHEREUM_AAVE_ADDRESS_PROVIDER_ADDR`  | Address of the AAVE address provider.                                         |
| `FLU_ETHEREUM_ATOKEN_ADDR`                 | Address of the AToken to use for the underlying token.                        |
| `FLU_ETHEREUM_USD_TOKEN_ADDR`              | Token address to use to look up the price of Ethereum using AAVE.             |
| `FLU_ETHEREUM_ETH_TOKEN_ADDR`              | Token address to use to look up to get the price of Ethereum using AAVE.      |
| `FLU_ETHEREUM_UNDERLYING_TOKEN_ADDR`       | Underlying token address to use to get the APY of a token from AAVE.          |
| `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`       | Underlying token name to use to get the APY and to communicate to the worker. |
| `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`   | Underlying token decimals in place (18 for DAI, 6 for USDT and USDC, etc).    |
| `FLU_ETHEREUM_AMQP_QUEUE_NAME`             | Queue name to send messages down from the worker server to the client.        |

## Environment variables (Ethereum client)

|               Name                |                                  Description                                  |
|-----------------------------------|-------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                   | Worker ID used to identify the application in logging and to the AMQP queue.  |
| `FLU_REDIS_ADDR`                  | Someone might actually have to explain this to me (breadcrumb?)               |
| `FLU_DEBUG`                       | Toggle debug messages produced by any application using the debug logger.     |
| `FLU_AMQP_QUEUE_ADDR`             | AMQP queue address connected to to receive and send messages down.            |
| `FLU_ETHEREUM_HTTP_URL`           | URL to use to chat to an Ethereum RPC node.                                   |
| `FLU_ETHEREUM_WORKER_PRIVATE_KEY` | Private key to use to sign transfers paying out users.                        |
| `FLU_ETHEREUM_GAS_LIMIT`          | Gas limit to use on bad chains. Should be used on Ropsten with `8000000`.     |
| `FLU_ETHEREUM_HARDHAT_FIX`        | If set to true, then a fix should be used to use the last block's gas limit.  |
| `FLU_ETHEREUM_AMQP_QUEUE_NAME`    | Queue name to receive messages from the server down.                          |

## Environment variables (Solana)
​
|              Name               |                                  Description                                 |
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

## Testing

Testing utilises the standard `testing` package as well as `testify` for assertions. To run unit tests (integration tests will fail):

	make test

To display overall test coverage:

	make test-coverage

Packages relying on external connections are tested using Docker:

	make docker-test
	make docker-test-coverage
	make docker-test-verbose

## Building

	make build

## Building (Docker)

	make docker
