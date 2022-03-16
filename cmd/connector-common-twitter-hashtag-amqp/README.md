
# Twitter Fluidity hashtag to AMQP connector

Stream tweets shared on the hashtags passed via environment variable
into AMQP.

## Environment variables

|            Name            |                                Description
|----------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`            | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`      | AMQP queue address connected to to receive and send messages down.           |
| `FLU_TWITTER_BEARER_TOKEN` | Bearer token used to authenticate with Twitter to use the streams API.       |
| `FLU_TWITTER_HASHTAGS`     | Hashtags to filter for when streaming Twitter data.                          |

## Building

	make build

## Testing

	make test

## Docker

	make docker
