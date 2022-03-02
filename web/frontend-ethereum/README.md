
# Fluidity Web Wallet

Fluidity is a stablecoin for people who can’t afford to leave their
money idle generating interest. Fluidity rewards users when they actually
use it.

This codebase contains a React webapp for interacting with Fluidity.

## Environment variable

|                Name                 |                                Description
|-------------------------------------|-----------------------------------------------------------------------------------|
| `REACT_APP_API_URL`                 | HTTP address used to make POST requests to the application backend with.          |
| `REACT_APP_WALLET_CONNECT_GETH_URI` | Websocket address used to connect to Geth with.                                   |
| `REACT_APP_WEBSOCKET`               | Websocket address used to connect to the backend.                                 |
| `FLU_PUBLIC_URL`                    | URL for where this webapp will be hosted (http://localhost:3000 ie)               |
| `REACT_APP_CHAIN_ID` | ID of the chain to connect to (3 for Ropsten, 31337 for local network) - also configures tokens to use. |

## Building

	make build

## Building (Docker)

	make docker

## Watching

	make watch

## Deployment

[Read more about it here](Deployment.md)
