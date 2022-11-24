
# microservice-ethereum-manual-rewards-signer

microservice-ethereum-manual-rewards-signer provides web endpoints for fetching and signing manual reward payloads for ethereum.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_ETHEREUM_WORKER_PRIVATE_KEY_LIST`                      | shortname:key,shortname:key list of worker private keys for signing manual reward payloads. |
| `FLU_ETHEREUM_CHAIN_ID`                      | chainid of the blockchain being used. |
| `FLU_ETHEREUM_TOKENS_LIST`                      | address:shortname:decimals list of tokens to support. |
| `FLU_ETHEREUM_NETWORK`                      | name of the ethereum network being used. |

## Building

    make build

## Testing

    make test

## Docker

    make docker
