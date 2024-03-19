
# microservice-sui-worker

Receives decorated transfers, determines if they win, and pays them out if so!

## Environment variables

|             Name                       |                        Description
|----------------------------------------|----------------------------------------------------------------------------------------|
| `FLU_SUI_HTTP_URL`                     | URL of the Sui RPC Websocket for event subscription.                                   |
| `FLU_SUI_UNDERLYING_TOKEN_NAME`        | Name of the token that's being tracked for winners.                                    |
| `FLU_SUI_UNDERLYING_TOKEN_DECIMALS`    | Number of underlying decimals supported by the token.                                  |
| `FLU_SUI_UNDERLYING_PACKAGE_ID`        | Object ID of the underlying token.                                                     |
| `FLU_SUI_FLUID_PACKAGE_ID`             | Object ID of the fluid token.                                                          |
| `FLU_SUI_UTILITY_CONTRACTS`            | Utility contracts in the form name:token_short_name:token_decimals:address:address,... |
| `FLU_SUI_WORKER_MNEMONIC`              | Private mnemonic to derive the worker keys from.                                       | 
| `FLU_SUI_PRIZE_POOL_VAULT_ID`          | Object ID of the prize pool vault.                                                     | 
| `FLU_SUI_SCALLOP_VERSION`              | Object ID of the scallop version.                                                      | 
| `FLU_SUI_SCALLOP_MARKET`               | Object ID of the scallop market.                                                       | 
| `FLU_SUI_COIN_RESERVE`                 | Object ID of the fluid token coin reserve.                                             | 


## Building

    make build

## Testing

    make test

## Docker

    make docker
