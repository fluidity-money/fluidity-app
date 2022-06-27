
# microservice-ethereum-application-server

Receives and processes logs for supported applications, then returns them to the
worker with additional information attached.

Supported contracts:
  - Uniswap V2
    
## Integrating a new application

There are four files/folders that need to be updated:

- `common/ethereum/applications/applications.go`

Add `Application<name>` to the Application Enum, and any relevant const values such as log topics.

- `common/ethereum/transfers.go`

Expand the switch case in `ClassifyApplicationLogTopic` to determine whether a given log corresponds to the application.

- `cmd/microservice-ethereum-application-server/main.go`

Update `getApplicationFee` and `getApplicationTransferParties` to include the new application.

- `common/ethereum/applications/<application name>`

Should contain functions necessary for supporting the application (finding fees, contract calls/ABI, etc.).

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                             | Worker ID used to identify the application in logging and to the AMQP queue.  |
| `FLU_DEBUG`                                 | Toggle debug messages produced by any application using the debug logger.     |
| `FLU_AMQP_QUEUE_ADDR`                       | AMQP queue address connected to to receive and send messages down.            |
| `FLU_SENTRY_URL`                            | String that may be optionally set with a Sentry URL to log app.               |
| `FLU_REDIS_HOST`                            | Hostname to connect to for the Redis (state) codebase.                        |
| `FLU_ETHEREUM_CONTRACT_ADDR`                | Address of the application contract.                                          |
| `FLU_ETHEREUM_HTTP_URL`                     | URL to use to chat to an Ethereum RPC node.                                   |
| `FLU_ETHEREUM_UNDERLYING_TOKEN_DECIMALS`    | Underlying token decimals in place (18 for DAI, 6 for USDT and USDC, etc).    |

## Building

    make build

## Testing

    make test

## Docker

    make docker
