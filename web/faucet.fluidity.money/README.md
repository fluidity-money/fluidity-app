
# Ethereum Testnet Faucet

This code presents a faucet interface for use with interacting with the
testing chain faucets we provide.

## Backend environment variables


|           Name           |                              Description
|--------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`              | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_WEB_LISTEN_ADDR`    | Host:port to listen on when using web.                                       |
| `FLU_AMQP_QUEUE_ADDR`    | AMQP queue address connected to to receive and send messages down.           |
| `FLU_POSTGRES_URI`       | Database URI to use when connecting to the Postgres database.                |
| `FLU_REDIS_HOST`         | Hostname to connect to for the Redis (state) codebase.                       |
| `FLU_REDIS_PASSWORD`     | Password to use when connecting to the Redis host.                           |

## Building

	make build
