
# AMQP copy messages microservice

Cheeky microservice to copy messages from one source to another in lieu
of using shovel and federated.

## Environment variables

|               Name              |                               Description
|---------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                 | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                     | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_SENTRY_URL`                | String that may be optionally set with a Sentry URL to log app.              |
| `FLU_AMQP_QUEUE_ADDR`           | AMQP queue address connected to to receive and send messages down.           |
| `FLU_AMQP_COPY_FROM_EXCHANGE`   | AMQP exchange to copy messages from.                                         |
| `FLU_AMQP_COPY_FROM_URI`        | AMQP uri to connect to and copy messages from.                               |
| `FLU_AMQP_COPY_FROM_TOPIC_NAME` | AMQP topic to copy messages from and relay.                                  |
| `FLU_AMQP_COPY_TO_EXCHANGE`     | AMQP exchange to copy messages to.                                           |
| `FLU_AMQP_COPY_TO_URI`          | AMQP uri to copy messages to.                                                |
| `FLU_AMQP_COPY_TO_TOPIC_NAME`   | AMQP topic to publish messages to.                                           |

## Building

	make build
