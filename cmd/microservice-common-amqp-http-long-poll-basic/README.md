
# Common AMQP http long poll basic

Listens on the address and path given, collecting all messages on the
AMQP and relaying down HTTP long pull after BASIC.

## Environment variables

|          Name          |                                      Description
|------------------------|-------------------------------------------------------------------------------------------|
| `FLU_WORKER_ID`        | Worker ID used to identify the application in logging and to the AMQP queue.              |
| `FLU_DEBUG`            | Toggle debug messages produced by any application using the debug logger.                 |
| `FLU_SENTRY_URL`       | String that may be optionally set with a Sentry URL to log app.                           |
| `FLU_AMQP_QUEUE_ADDR`  | AMQP queue address connected to to receive and send messages down.                        |
| `FLU_WEB_LISTEN_ADDR`  | Listen address to use when hosting the HTTP long poll server.                             |
| `FLU_LONG_POLL_LOGINS` | Logins to allow for HTTP basic, separated by , (ie username:password,username1:password1) |

## Building

	make build

## Testing

	make test

## Docker

	make docker
