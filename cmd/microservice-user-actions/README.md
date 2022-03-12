
# User Actions Connector

Track user actions by observing logs output. Matches FluidMint, FluidBurn
and Transfer events.

## Environment variables

|             Name              |                              Description
|-------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`               | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                   | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`         | AMQP queue address connected to to receive and send messages down.           |
| `FLU_ETHEREUM_CONTRACT_ADDR`  | Track interactions with the contract at this address.                        |
| `FLU_ETHEREUM_TOKEN_NAME`     | Token name to use when tracking the token for user representation.           |
| `FLU_ETHEREUM_TOKEN_DECIMALS` | Token decimals to use when tracking user actions and sending them down AMQP. |

## Building

	make build

## Testing

	make test

## Docker

	make docker
