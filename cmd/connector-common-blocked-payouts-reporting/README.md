
# connector-common-blocked-payouts-reporting

Reports blocked payouts to discord.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_DISCORD_WEBHOOK`                     | Discord webhook address to report to. |
| `FLU_WORKER_ID`            | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`      | AMQP queue address connected to to receive and send messages down.           |

## Building

    make build

## Testing

    make test

## Docker

    make docker
