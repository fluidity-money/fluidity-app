
# microservice-ethereum-address-linking

Watches for events from the LootboxConfirmAddressOwnership contract, decodes them, and sends the result down rabbit.

## Environment variables

|                       Name                        |                                  Description
|---------------------------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                                   | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`                                       | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_AMQP_QUEUE_ADDR`                             | AMQP queue address connected to to receive and send messages down.           |
| `FLU_ETHERUEM_ADDRESS_CONFIRMATION_CONTRACT_ADDR` | The address of the LootboxConfirmAddressOwnership contract. |
| `FLU_ETHEREUM_NETWORK`                            | The network the service is running for. |

## Building

    make build

## Testing

    make test

## Docker

    make docker
