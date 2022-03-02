
# microservice-solana-transactions

Receives Solana logs from AMQP after being buffered by
`microservice-solana-buffer-logs-by-slot`, looks each of them up in
the buffer and creates a BufferedTransaction. Then sends those buffered
transactions down.

## Environment variables

|           Name           |                              Description
|--------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`              | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`    | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SOLANA_RPC_ADDR`    | Solana node RPC address to fetch transaction info from.                      |

## Building

	make build

## Testing

	make test

## Docker

	make docker
