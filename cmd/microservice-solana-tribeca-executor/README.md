# microservice-solana-tribeca-executor

Subscribes to emitted events from Tribeca, and funnels proposals through its lifecycle

## Tribeca Listener Environment Variables

|            Name                          |                                 Description                               |
|------------------------------------------|---------------------------------------------------------------------------|
| `FLU_SOLANA_TRIBECA_EXECUTOR_SECRET_KEY` | Payer secret key as B58. Should be a member of Tribeca executive council  |
| `FLU_TRF_DATA_STORE_SECRET_KEY`          | Trf Data Store Authority secret key as B58                                |
| `FLU_SOLANA_PAYER_PRIKEY`                | Fluidity Solana Authority secret key as B58                               |
| `FLU_TRIBECA_GOVERNOR_PUBKEY`            | Pubkey of Tribeca governor                                                |
| `FLU_TRIBECA_LOCKER_PUBKEY`              | Pubkey of Tribeca locker                                                  |
| `FLU_TRIBECA_SMART_WALLET_PUBKEY`        | Pubkey of Tribeca smart wallet                                            |
| `FLU_TRIBECA_EXEC_COUNCIL_PUBKEY`        | Pubkey of Tribeca multi-sig wallet SECRET_KEY is part of                  |
| `FLU_SOLANA_RPC_URL`                     | Solana node RPC address to fetch transaction info from.                   |
| `FLU_SENTRY_URL`                         | Sentry URL                                                                |
| `FLU_WORKER_ID`                          | Worker ID for context inside Sentry                                       |

## Building Tribeca listener
`make docker`

## Running Tribeca listener
`npx ts-node microservice-solana-tribeca-executor.ts`

