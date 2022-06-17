
# microservice-ethereum-application-server

Receives and process blocks containing application logs of interest.

Supported contracts:
  - Uniswap transfer

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                             | Worker ID used to identify the application in logging and to the AMQP queue.  |
| `FLU_DEBUG`                                 | Toggle debug messages produced by any application using the debug logger.     |
| `FLU_AMQP_QUEUE_ADDR`                       | AMQP queue address connected to to receive and send messages down.            |
| `FLU_SENTRY_URL`                            | String that may be optionally set with a Sentry URL to log app.               |
| `FLU_REDIS_HOST`                            | Hostname to connect to for the Redis (state) codebase.                        |

## Building

    make build

## Testing

    make test

## Docker

    make docker
