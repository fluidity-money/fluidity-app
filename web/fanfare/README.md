# Fanfare 🥳

Speedy notification service.

Currently geared towards ERC20-ish notifications but is pretty easy to rekit.

## Getting setup
Environment variables required largely depend on what services are active.
You'll need a websocket RPC for each service you attach to and possibly a secret for your GraphQL service.

Here is what we use at Fluidity:
|ENV | Description |
|:---|---|
|`PORT`| The port to bind (Default is `:3111`)
|`FLU_HASURA_ENDPOINT` | Used for connecting GraphQL for our centralized data.|
|`FLU_HASURA_SECRET` | The secret for that endpoint |
|`FLU_ETH_WS_RPC` | Ethereum RPC Websocket |
|`FLU_ETH_HEARTBEAT` | Ethereum Heartbeat URL |
|`FLU_ARB_WS_RPC` | Arbitrum RPC Websocket |
|`FLU_ARB_HEARTBEAT` | Arbitrum Heartbeat URL |
|`FLU_SOL_WS_RPC` | Solana RPC Websocket |
|`FLU_SOL_HEARTBEAT` | Solana Heartbeat URL |

Have fun!

## Reliability features
|Feature|Description|
|:---|---|
|Heartbeats|Indicates internal health of cluster services|
|Watchdog | Checks external RPC health by periodically calling a method|
|Reconnection|On connection error, reconnect the websocket