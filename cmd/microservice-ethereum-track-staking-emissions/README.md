
# microservice-ethereum-track-staking-emissions

Track `Staked` event emissions from the staking contract in Timescale.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                              | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`                    | AMQP queue address connected to to receive and send messages down.           |

## Building

    make build

## Testing

    make test

## Docker

    make docker
