
# microservice-ethereum-application-server

Receives and processes logs for supported applications, then returns them to the
worker with additional information attached.

Supported contracts:
  - Uniswap V2

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                             | Worker ID used to identify the application in logging and to the AMQP queue.  |
| `FLU_DEBUG`                                 | Toggle debug messages produced by any application using the debug logger.     |
| `FLU_AMQP_QUEUE_ADDR`                       | AMQP queue address connected to to receive and send messages down.            |
| `FLU_SENTRY_URL`                            | String that may be optionally set with a Sentry URL to log app.               |
| `FLU_REDIS_HOST`                            | Hostname to connect to for the Redis (state) codebase.                        |
| `FLU_ETHEREUM_CONTRACT_ADDR`                | Address of the ethereum contract to call.                                     |
| `FLU_ETHEREUM_HTTP_URL`                     | URL to use to chat to an Ethereum RPC node.                                   |
| `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`    | Underlying token decimals in place (18 for DAI, 6 for USDT and USDC, etc).    |

## Building

    make build

## Testing

    make test

## Docker

    make docker
