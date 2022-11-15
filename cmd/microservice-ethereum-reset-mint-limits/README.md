
# microservice-key-rotation

Update the mint limits in a Token using the updateMintLimits
function and shares on Discord the status of the transactions. Uses
two JSON files in this directory after getting the current time then
converting to UTC.

## Environment variables

|          Name           |                               Description
|-------------------------|---------------------------------------------------------------------------|
| `FLU_WORKER_ID`         | Worker ID used to identify the application in logging                     |
| `FLU_DEBUG`             | Toggle debug messages produced by any application using the debug logger. |
| `FLU_ETHEREUM_HTTP_URL` | HTTP address to use to connect to Geth.                                   |
| `FLU_DISCORD_WEBHOOK`   | Discord webhook to use when the Discord Notify function is used.          |

## Building

    make build

## Testing

    make test

## Docker

    make docker
