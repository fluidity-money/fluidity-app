
# Track Winners Microservice

Take a list of contracts to watch and report when one of them generates a
`Reward` event.

## Environment variables

|                   Name                   |                                  Description
|------------------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                              | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`                    | AMQP queue address connected to to receive and send messages down.           |
| `FLU_ETHEREUM_CONTRACT_ADDR`             | Contract address to watch transfers made with.                               |
| `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`     | Name of the token that's being tracked for winners.                          |
| `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS` | Number of underlying decimals supported by the token.                        |

## Building

	make build

## Testing

	make test

## Docker

	make docker
