
# microservice-solana-transactions

Receives Solana logs from AMQP after being buffered by
`microservice-solana-buffer-logs-by-slot`, looks each of them up in
the buffer and creates a BufferedTransaction. Then sends those buffered
transactions down.

Also understands fee structures emitted by the logs from each transaction
seen in the intermediary process. For this reason, it will look up Saber
to get information from the RPC sometimes.

## Environment variables

|            Name            |                                 Description
|----------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`            | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`      | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SOLANA_RPC_URL`       | Solana node RPC address to fetch transaction info from.                      |

## Building

	make build

## Testing

	make test

## Docker

	make docker
