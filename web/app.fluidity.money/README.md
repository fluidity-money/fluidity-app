# Fluidity app app.fluidity.money

## Environment variables

| Name                    | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `FLU_BITQUERY_TOKEN`    | Token to subscribe to BitQuery                            |
| `FLU_ETH_RPC_HTTP`      | URI to fetch ETH transactions                             |
| `FLU_ETH_RPC_WS`        | URI to subscribe to ETH transactions                      |
| `FLU_SOL_RPC_HTTP`      | URI to fetch SOL transactions                             |
| `FLU_SOL_RPC_WS`        | URI to subscribe to SOL transactions                      |
| `FLU_HASURA_RPC_HTTP`   | URI to fetch winners data from db (hasura interface)      |
| `FLU_HASURA_RPC_WS`     | URI to subscribe to winners data on db (hasura interface) |
| `FLU_HASURA_SECRET`     | Hasura admin secret used in client headers for RPC calls  |
| `FLU_SENTRY_DSN`        | Sentry reporting URI                                      |
| `FLU_SPLIT_BROWSER_KEY` | Split Client-Side Key                                     |

## Building

    npm run build

## Development

    npm run dev
