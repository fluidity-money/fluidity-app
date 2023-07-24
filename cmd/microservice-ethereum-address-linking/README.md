
# microservice-ethereum-address-linking

Watches for events from the LootboxConfirmAddressOwnership contract, decodes them, and sends the result down rabbit.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_ETHEREUM_ADDRESS_CONFIRMATION_CONTRACT_ADDR`                      | The address of the LootboxConfirmAddressOwnership contract. |
| `FLU_ETHEREUM_NETWORK`                      | The network the service is running for. |

## Building

    make build

## Testing

    make test

## Docker

    make docker
