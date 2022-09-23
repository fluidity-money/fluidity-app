
# microservice-key-rotation

Update the mint limits in a Token using the updateMintLimits
function. Also posts to Discord updates.

## Environment variables

|                Name              |                                  Description
|----------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                  | Worker ID used to identify the application in logging                        |
| `FLU_DEBUG`                      | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_ETHEREUM_HTTP_URL`          | HTTP address to use to connect to Geth.                                      |
| `FLU_ETHEREUM_CONTRACT_ADDR`     | Contract address to call updateMintLimits on                                 |
| `FLU_DISCORD_WEBHOOK`            | Discord webhook to use when the Discord Notify function is used.             |
| `FLU_ETHEREUM_GLOBAL_MINT_LIMIT` | Global mint limit to update (number without any decimal adjustment!)         |
| `FLU_ETHEREUM_USER_USER_LIMIT`   | User mint limit to update (number without any decimal adjustment!)           |

## Building

    make build

## Testing

    make test

## Docker

    make docker
