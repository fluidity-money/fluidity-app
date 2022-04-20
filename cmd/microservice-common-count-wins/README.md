
# Count Wins Microservice

Counts wins that happened in the winners table as well as the amount
that was won and stores it in the past_winnings table.

## Environment variables

|            Name            |                                  Description
|----------------------------|--------------------------------------------------------------------------------|
| `FLU_WORKER_ID`            | Worker ID used to identify the application in logging and to the AMQP queue.   |
| `FLU_DEBUG`                | Toggle debug messages produced by any application using the debug logger.      |
| `FLU_POSTGRES_URI`         | Database URI to use when connecting to the Postgres database.                  |
| `FLU_TIMESCALE_URI`        | Database URI to use when connecting to the Postgres database.                  |
| `FLU_ETHEREUM_TOKENS_LIST` | Tokens on Ethereum in the format (<contract addr>,<token name>:<decimals>,...) |
| `FLU_SOLANA_TOKENS_LIST`   | Tokens on Solana in the format (<contract addr>,<token name>:<decimals>,...)   |

## Building

	make build

## Testing

	make test

## Docker

	make docker
