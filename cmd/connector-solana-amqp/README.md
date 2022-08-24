
# connector-solana-amqp

Relays transaction logs from the Solana websocket down AMQP.

## Environment variables

|            Name            |                              Description
|----------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`            | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`      | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SOLANA_WS_URL`        | Solana node websocket address to receive logs subscriptions from.            |
| `FLU_SOLANA_STARTING_SLOT` | Slot to search from, or `latest`, or empty to use last seen in redis.        |
| `FLU_REDIS_ADDR`           | Hostname to connect to for the Redis (state) codebase.                       |
| `FLU_REDIS_PASSWORD`       | Password to use when connecting to the Redis host.                           |

## Building

	make build

## Testing

	make test

## Docker

	make docker
