
# Track tweets to faucet

Track tweets, look them up in the payouts database and send a message
down the internal message queue to the microservice that triggers a
faucet payout.

## Environment variables

|          Name          |                                 Description
|------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`        | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`            | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`  | AMQP queue address connected to to receive and send messages down.           |
| `FLU_POSTGRES_URI`     | Database URI to use when connecting to the Postgres database.                |
| `FLU_TWITTER_HASHTAGS` | Hashtags separated with a comma to filter for.                               |
| `FLU_SLACK_WEBHOOK`    | Slack webhook to use when the Slack Notify function is used.                 |

## Building

	make build

## Testing

	make test

## Docker

	make docker
