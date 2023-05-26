
# Fluidity Ethereum Contracts

## Environment variables (deploying)

|                Name                  |                            Description
|--------------------------------------|-----------------------------------------------------------------------|
| `FLU_ETHEREUM_ORACLE_ADDRESS`        | Public key of the signer that supplies random numbers.                |
| `FLU_ETHEREUM_DEPLOY_TARGETS`        | Number of deployment backends for the beacon, separated by ,          |
| `FLU_ETHEREUM_TOKEN_BACKEND`         | Token backend to support in the token contract deploy (aave/compound) |
| `FLU_ETHEREUM_BEACON_POOL`           | Deployed token pool to use for the underlying lending source          |
| `FLU_ETHEREUM_BEACON_TOKEN`          | Token deployed during the beacon deplyoment stage that's used         |
| `FLU_ETHEREUM_AAVE_ATOKEN_ADDRESS`   | Atoken address for the underlying token (ie, aUSDC)                   |
| `FLU_ETHEREUM_AAVE_PROVIDER_ADDRESS` | Provider address for the lending pool (ie V2 in the example below)    |
| `FLU_ETHEREUM_DECIMALS`              | Number of decimals used by the underlying token                       |
| `FLU_ETHEREUM_TOKEN_SYMBOL`          | Symbol of the token to use (ie USDC for USD Coin)                     |
| `FLU_ETHEREUM_TOKEN_NAME`            | Name of the underlying token (ie USD Coin for USDC)                   |

## Environment variables (deploying on a network using Hardhat scripts)

|                   Name                                    Description
|--------------------------------------------|-------------------------------------|
|  `FLU_ETHEREUM_DEPLOY_ROPSTEN_URL`         | Ropsten URL to use for deployment   |
|  `FLU_ETHEREUM_DEPLOY_KOVAN_URL`           | Kovan URL for deployment            |
|  `FLU_ETHEREUM_DEPLOY_AURORA_MAINNET_URL`  | Aurora mainnet key for deployment   |
|  `FLU_ETHEREUM_DEPLOY_RINKEBY_TESTNET_URL` | Rinkeby testnet URL for deployment  |
|  `FLU_ETHEREUM_DEPLOY_ARBITRUM_KEY`        | Arbitrum URL for deployment         |
|  `FLU_ETHEREUM_DEPLOY_ROPSTEN_KEY`         | Key to use for a Ropsten deployment |
|  `FLU_ETHEREUM_DEPLOY_ARBITRUM_URL`        | URL to use for a Arbitrum script    |
