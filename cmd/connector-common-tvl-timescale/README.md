
# connector-common-tvl-timescale

connector-common-tvl-timescale receives tvl updates and writes them into timescale.

## Environment variables

|         Name          |                              Description
|-----------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`       | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`           | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_SENTRY_URL`      | String that may be optionally set with a Sentry URL to log app.              |
| `FLU_AMQP_QUEUE_ADDR` | AMQP queue address connected to to receive and send messages down.           |
| `FLU_TIMESCALE_URI`   | Database URI to use when connecting to the Timescale database.               |

## Building

	make build

## Testing

	make test

## Docker

	make docker
