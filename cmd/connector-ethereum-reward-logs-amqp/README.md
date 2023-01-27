
# connector-ethereum-reward-logs-amqp

Watches for the following events over the Geth websocket:

- `Reward`

- `BlockedReward`

- `UnblockReward`

- `Transfer`

- `MintFluid`

- `BurnFluid`

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_ETHEREUM_WS_URL`                      | Geth websocket address to use to receive Ethereum logs from. |
| `FLU_ETHEREUM_TOKENS_LIST`                      | List of tokens in address:shortname:decimals form to watch for events. |

### `FLU_ETHEREUM_START_BLOCK`

If set to `""`, then Redis will be used to determine the height to read
from at the appropriate key. If set to `latest`, then the latest block
will be used. If set to a number, that block height will be read from
initially.

## Building

    make build

## Testing

    make test

## Docker

    make docker
