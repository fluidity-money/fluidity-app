
# Ethereum faucet send amounts

Uses the transfer function in the contract to send amounts to people in
response to messages over the wire.

## Environment variables

|                Name               |                                  Description
|-----------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                   | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                       | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_SENTRY_URL`                  | String that may be optionally set with a Sentry URL to log app.              |
| `FLU_AMQP_QUEUE_ADDR`             | AMQP queue address connected to to receive and send messages down.           |
| `FLU_ETHEREUM_TOKENS_LIST`        | List of tokens to track, of the form `ADDR1:fTOKEN1,ADDR2:fTOKEN2,...`       |
| `FLU_ETHEREUM_HTTP_URL`           | Address to use to connect to Geth to query the state of the balance with.    |
| `FLU_ETHEREUM_FAUCET_PRIVATE_KEY` | Private key to sign requests to send amounts with.                           |

## Building

	make build

## Testing

	make test

## Docker

	make docker
