# Fluidity Web Wallet

Fluidity is a stablecoin for people who can’t afford to leave their
money idle generating interest. Fluidity rewards users when they actually
use it.

This codebase contains a Solana-compatible React webapp.

## Environment variable

|                Name                 |                                Description
|-------------------------------------|-----------------------------------------------------------------------------------|
| `REACT_APP_API_URL`                 | HTTP address used to make POST requests to the application backend with.          |
| `REACT_APP_WEBSOCKET`               | Websocket address used to connect to the backend.                                 |
| `REACT_APP_FLUID_PROGRAM_ID`        | Program ID of the fluidity program.                                               |
| `REACT_APP_FLU_MINT_USDC`           | Websocket address used to connect to the backend.                                 |
| `REACT_APP_FLU_OBLIGATION_USDC`     | Public key of the solend USDC obligation account.                                 |
| `REACT_APP_FLU_DATA_ACCOUNT_USDC`   | Public key of the solend USDC data account.                                       |
| `REACT_APP_BASE_MINT_USDC`          | Public key of the solend USDC base mint account.                                  |
| `REACT_APP_FLU_MINT_USDT`           | Public key of the solend USDT mint account.                                       |
| `REACT_APP_FLU_OBLIGATION_USDT`     | Public key of the solend USDT obligation account.                                 |
| `REACT_APP_FLU_DATA_ACCOUNT_USDT`   | Public key of the solend USDT data account.                                       |
| `REACT_APP_BASE_MINT_USDT`          | Public key of the solend USDT base mint account.                                  |
| `REACT_APP_FLU_MINT_UST`            | Public key of the solend UST mint account.                                        |
| `REACT_APP_FLU_OBLIGATION_UST`      | Public key of the solend UST obligation account.                                  |
| `REACT_APP_FLU_DATA_ACCOUNT_UST`    | Public key of the solend UST data account.                                        |
| `REACT_APP_BASE_MINT_UST`           | Public key of the solend UST base mint account.                                   |
| `REACT_APP_FLU_MINT_UXD`            | Public key of the solend UXD mint account.                                        |
| `REACT_APP_FLU_OBLIGATION_UXD`      | Public key of the solend UXD obligation account.                                  |
| `REACT_APP_FLU_DATA_ACCOUNT_UXD`    | Public key of the solend UXD data account.                                        |
| `REACT_APP_BASE_MINT_UXD`           | Public key of the solend UXD base mint account.                                   |

## Building

	make build

## Building (Docker)

	make docker

## Watching

	make watch