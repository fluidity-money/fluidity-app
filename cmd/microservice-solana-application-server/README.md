
# microservice-solana-application-server

Processes transactions that have been tagged with application events,
sending them to the worker with additional information attached.

Supported contracts:
 - Saber

## Integrating a new application

Update the list above with the name of the application!
Then, update:

 - `common/solana/applications/applications.go`

 Add `Application<name>` to the `Applications` enum. Add `"name": Application<name>` to the `applicationNames` map.

 - `cmd/microservice-solana-application-server/lib/<name>/`

 Add a folder for your application, and add code to calculate the app fee (and sender/receiver, if necessary).

 - `cmd/microservice-solana-application-server/main.go`

 Add code to the switch in `parseTransaction` to call your calculation function.

Update the environment variable `FLU_SOLANA_APPLICATIONS_LIST` in microservice-solana-transactions to include `name:address`, where `name` is your application's name and `address` is a solana account that will be included in relevant transactions. If your application has multiple addresses, specify `name:address,name:address2,etc`.

## Environment variables

|             Name                   | Description
|------------------------------------|--------------------------------------------------------------------------------|
| `FLU_WORKER_ID`                    | Worker ID used to identify the application in logging and to the AMQP queue.   |
| `FLU_DEBUG`                        | Toggle debug messages produced by any application using the debug logger.      |
| `FLU_AMQP_QUEUE_ADDR`              | AMQP queue address connected to to receive and send messages down.             |
| `FLU_SENTRY_URL`                   | String that may be optionally set with a Sentry URL to log app.                |
| `FLU_SOLANA_RPC_URL`                    | Address of the Solana node.   |
| `FLU_SOLANA_TOKEN_LOOKUPS`                    | JSON object of {[fluidToken: string]: baseToken: string}.   |
| `FLU_SOLANA_SABER_SWAP_PROGRAM_ID` | Program ID for the Saber swap program.                                         |
| `FLU_SOLANA_SABER_RPC_URL`         | RPC endpoint used to look up information from Saber.                           |
| `FLU_SOLANA_ORCA_PROGRAM_ID` | Program ID for the Orca swap program.                                         |
| `FLU_SOLANA_RAYDIUM_PROGRAM_ID` | Program ID for the Raydium swap program.                                         |

## Building

    make build

## Testing

    make test

## Docker

    make docker
