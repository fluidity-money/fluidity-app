# Fluidity app app.fluidity.money

## Environment variables

| Name                  | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `BITQUERY_TOKEN`      | Token to subscribe to BitQuery                            |
| `HASURA_TOKEN`        | Admin Token to query Hasura                               |
| `FLU_ETH_RPC_HTTP`    | URI to fetch ETH transactions                             |
| `FLU_ETH_RPC_WS`      | URI to subscribe to ETH transactions                      |
| `FLU_SOL_RPC_HTTP`    | URI to fetch SOL transactions                             |
| `FLU_SOL_RPC_WS`      | URI to subscribe to SOL transactions                      |
| `FLU_HASURA_RPC_HTTP` | URI to fetch winners data from db (hasura interface)      |
| `FLU_HASURA_RPC_WS`   | URI to subscribe to winners data on db (hasura interface) |
| `FLU_HASURA_SECRET`   | Hasura admin secret used in client headers for RPC calls  |
| `SENTRY_DSN`          | Sentry reporting URI                                      |

## Building

    npm run build

## Development

    npm run dev
