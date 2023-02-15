# Fanfare 🥳

Speedy notification service.

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
|`FLU_ARB_WS_RPC` | Arbitrum RPC Websocket |
|`FLU_SOL_WS_RPC` | Solana RPC Websocket |\

Have fun!

