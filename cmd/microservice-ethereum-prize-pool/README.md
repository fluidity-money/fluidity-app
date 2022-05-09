
# Track prize pool microservice

Track the current state of the prize pool by querying the contract
specified as an environment variable each time a block update is received
over the shared bus.

## Environment variables

|                    Name                   |                                    Description
|-------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                           | Worker ID used to identify the application in logging and to the AMQP queue.                                  |
| `FLU_DEBUG`                               | Toggle debug messages produced by any application using the debug logger.                                     |
| `FLU_AMQP_QUEUE_ADDR`                     | AMQP queue address connected to to receive and send messages down.                                            |
| `FLU_ETHEREUM_HTTP_URL`                   | Address to use to connect to Geth to query the state of the balance with.                                     |
| `FLU_ETHEREUM_TOKENS_LIST`                | Tokens list to filter for and to select when sending down the message bus.                                    |
| `FLU_ETHEREUM_TOKEN_BACKEND`              | Backend that fluid tokens are deployed to (`aave`, `compound`, or empty for token-specific).                  |
| `FLU_ETHEREUM_UNISWAP_ANCHORED_VIEW_ADDR` | Contract address of the Uniswap anchored view to use as a price oracle - Compound only.                       |
| `FLU_ETHEREUM_AAVE_ADDRESS_PROVIDER_ADDR` | AAVE contract to look up token prices - AAVE only.                                                            |
| `FLU_ETHEREUM_USD_TOKEN_ADDR`             | USDT address to look up the price of USD for price scaling - AAVE only.                                       |

## Tokens list

Tokens should be passed to this program like the following:

	<contract address>:<underlying token name>:<number of decimal places>:<optional underlying token address>:<optional token backend>

The fourth parameter is required on AAVE-based platforms for price lookup.

The final parameter is required for deployments utilising both Compound and AAVE backed tokens.

The final paramter is required for deployments utilising both Compound
and AAVE backed tokens.

So for example, with the contract on Ropsten, it would look like the
following:

	0x26FC224B37952Bd12C792425F242E0B0a55453a6:USDT:6

To support multiple tokens, you would separate this block using a comma
(,).

You might do something similar to the following in practice (example for testnet)

	FLU_ETHEREUM_TOKENS_LIST=\
		0x9391202B846ee3f574e59E4AD58ef6140E9ba4F6:USDT:6,\
		0x737f9DC58538B222a6159EfA9CC548AB4b7a3F1e:USDC:6, \
		0xdDd63f96e78dCed5B6ef17Ee285F2cDbDF8972Ab:DAI:18

(With `FLU_ETHEREUM_TOKENS_LIST` being you exporting the environment
variable...)

This will scan each token on a per-block basis using Geth using
concurrency to get each simultaneously.

## Building

	make build

## Testing

	make test

## Docker

	make docker
