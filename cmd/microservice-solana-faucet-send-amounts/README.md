
# Solana send faucet amounts microservice

Send amounts when messages are received down the wire, similar to
`microservice-ethereum-faucet-send-amounts`.

## Environment variables

|               Name              |                              Description
|---------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                 | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                     | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_SENTRY_URL`                | String that may be optionally set with a Sentry URL to log app.              |
| `FLU_AMQP_QUEUE_ADDR`           | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SOLANA_PROGRAM_ID`         | To use as the token address as the Fluidity program to send amounts with.    |
| `FLU_SOLANA_FAUCET_PRIVATE_KEY` | Private key to use to transfer amounts with.                                 |
| `FLU_SOLANA_FAUCET_SENDER_ADDR` | Address of the token account to send from, must be owned by the private key. |
| `FLU_SOLANA_DEBUG_FAKE_PAYOUTS` | If set to true, don't send any amounts out when users request it.            |

## Building

	make build

## Testing

	make test

## Docker

	make docker
