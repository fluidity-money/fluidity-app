
# microservice-ethereum-release-blocked-payout

Takes a blocked payout payload from discord and creates the transaction that can be used to release or remove it from the contract.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_ETHEREUM_BLOCKED_PAYOUT_PAYLOAD`                      | The payload for the blocked reward, sent to discord as a JSON blob. |
| `FLU_ETHEREUM_PAYOUT`                      | `true` if the reward should be unblocked and sent, `false` if the reward should be discarded. |

## Building

    make build

## Testing

    make test

## Docker

    make docker
