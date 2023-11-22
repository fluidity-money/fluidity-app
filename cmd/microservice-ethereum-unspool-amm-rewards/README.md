
# microservice-ethereum-unspool-amm-rewards

Watches for AMM fee collection events and unspools LP rewards from the database.

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_ETHEREUM_AMM_ADDRESS`                      | Address of the AMM to track. |
| `FLU_ETHEREUM_LP_REWARD_AMQP_QUEUE_NAME`                      | Queue to send unspooled rewards to the sender down. |
| `FLU_ETHEREUM_TOKEN_SHORT_NAME`                      | Short name of the token to track AMM rewards for. |
| `FLU_ETHEREUM_NETWORK`                      | Network to unspool AMM rewards for. |

## Building

    make build

## Testing

    make test

## Docker

    make docker
