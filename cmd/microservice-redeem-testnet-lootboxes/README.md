
# microservice-redeem-testnet-lootboxes

Watch for events indicating ownership of a testnet address and reward
the owner.

If an epoch is not currently running, then this should break as
someone is using the contract improperly.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                              | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`                    | AMQP queue address connected to to receive and send messages down.           |
| `FLU_ADDRESS_CONFIRMER_CONTRACT_ADDRESS` | Contract address for the address confirmer.                                  |

## Building

    make build

## Testing

    make test

## Docker

    make docker
