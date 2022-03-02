
# Queue degradation alert microservice

## Environment variables

|         Name          |                              Description
|-----------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`       | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`           | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_SENTRY_URL`      | String that may be optionally set with a Sentry URL to log app.              |
| `FLU_AMQP_QUEUE_ADDR` | AMQP queue address connected to to receive and send messages down.           |
| `FLU_SLACK_WEBHOOK`   | Slack webhook to use when the Slack Notify function is used.                 |
| `FLU_REDIS_HOST`      | Hostname to connect to for the Redis (state) codebase.                       |
| `FLU_REDIS_PASSWORD`  | Password to use when connecting to the Redis host.                           |

## Building

	make build

## Testing

	make test

## Docker

	make docker
