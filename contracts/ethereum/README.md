
# Fluidity Ethereum Contracts

## Environment variables

|                 Name                 |                              Description
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

## How to deploy the contract?

Multiple contracts must be deployed to use Fluidity correctly. First
the beacon must be deployed:

With beacon (worker) public key of `0x85c57817bdc65d83f90e320bdbdde8cce473f7e0`:

	\
		FLU_ETHEREUM_ORACLE_ADDRESS=0x85c57817bdc65d83f90e320bdbdde8cce473f7e0 \
		FLU_ETHEREUM_DEPLOY_TARGETS=token,aave,compound

	npx hardhat run scripts/deploy-beacon.ts --network localhost

(Paying attention to the output from above, we get:)

	deploying beacon for token...
	deployed token to 0x967AB65ef14c58bD4DcfFeaAA1ADb40a022140E5
	deploying beacon for aave liquidity pool...
	deployed aave liquidity pool to 0xe1708FA6bb2844D5384613ef0846F9Bc1e8eC55E
	deploying beacon for compound liquidity pool...
	deployed compound liquidity pool to 0x0aec7c174554AF8aEc3680BB58431F6618311510
	done!

Noting the address of the deployed token
`0x967AB65ef14c58bD4DcfFeaAA1ADb40a022140E5`, AAVE
(`0xe1708FA6bb2844D5384613ef0846F9Bc1e8eC55E`) and Compound liquidity
pool: `0x0aec7c174554AF8aEc3680BB58431F6618311510`.

Then for each individual contract (if you wanted to use AAVE, you would
set `TOKEN_BACKEND` to `aave` here, change the beacon pool address and
set the variables for AAVE). This example is for USDC (`cUSDC` is
`0x39AA39c021dfbaE8faC545936693aC917d5E7563`)


	\
		FLU_ETHEREUM_ORACLE_ADDRESS=0x85c57817bdc65d83f90e320bdbdde8cce473f7e0 \
		FLU_ETHEREUM_TOKEN_BACKEND=compound \
		FLU_ETHEREUM_BEACON_POOL=0x0aec7c174554AF8aEc3680BB58431F6618311510 \
		FLU_ETHEREUM_BEACON_TOKEN=0x967AB65ef14c58bD4DcfFeaAA1ADb40a022140E5 \
		FLU_ETHEREUM_COMPOUND_CTOKEN_ADDRESS=0x39AA39c021dfbaE8faC545936693aC917d5E7563 \
		FLU_ETHEREUM_DECIMALS=18 \
		FLU_ETHEREUM_TOKEN_SYMBOL=USDC \
		FLU_ETHEREUM_TOKEN_NAME='USD Coin'

	npx hardhat run scripts/deploy-beacon-proxy.ts --network localhost

This would generate output similar to:

	deploying token with beacon address 0x967AB65ef14c58bD4DcfFeaAA1ADb40a022140E5
	token deployed to address 0x8e264821AFa98DD104eEcfcfa7FD9f8D8B320adA
	deploying compound pool with beacon 0x0aec7c174554AF8aEc3680BB58431F6618311510, ctoken 0x39AA39c021dfbaE8faC545936693aC917d5E7563
	liquidity pool deployed to address 0x871ACbEabBaf8Bed65c22ba7132beCFaBf8c27B5
	initialising token with oracle 0x85c57817bdc65d83f90e320bdbdde8cce473f7e0 decimals 18 symbol USDC name USD Coin
	done!

If you were to do the same deployment, but this time using **AAVE**
(again, USDC), with the V2 lending pool provider on mainnet as the
provider address (`0xb53c1a33016b2dc2ff3653530bff1848a515c8c5`):


	\
		FLU_ETHEREUM_ORACLE_ADDRESS=0x85c57817bdc65d83f90e320bdbdde8cce473f7e0 \
		FLU_ETHEREUM_TOKEN_BACKEND=aave \
		FLU_ETHEREUM_BEACON_POOL=0xe1708FA6bb2844D5384613ef0846F9Bc1e8eC55E \
		FLU_ETHEREUM_BEACON_TOKEN=0x967AB65ef14c58bD4DcfFeaAA1ADb40a022140E5 \
		FLU_ETHEREUM_AAVE_ATOKEN_ADDRESS=0x8dAE6Cb04688C62d939ed9B68d32Bc62e49970b1 \
		FLU_ETHEREUM_AAVE_PROVIDER_ADDRESS=0xb53c1a33016b2dc2ff3653530bff1848a515c8c5 \
		FLU_ETHEREUM_DECIMALS=18 \
		FLU_ETHEREUM_TOKEN_SYMBOL=USDC \
		FLU_ETHEREUM_TOKEN_NAME='USD Coin'

	npx hardhat run scripts/deploy-beacon-proxy.ts --network localhost

Which would generate output similar to the following:

	deploying token with beacon address 0x967AB65ef14c58bD4DcfFeaAA1ADb40a022140E5
	token deployed to address 0xC1e0A9DB9eA830c52603798481045688c8AE99C2
	deploying aave pool with beacon 0xe1708FA6bb2844D5384613ef0846F9Bc1e8eC55E, atoken 0x8dAE6Cb04688C62d939ed9B68d32Bc62e49970b1, aave pool 0xb53c1a33016b2dc2ff3653530bff1848a515c8c5
	liquidity pool deployed to address 0x683d9CDD3239E0e01E8dC6315fA50AD92aB71D2d
	initialising token with oracle 0x85c57817bdc65d83f90e320bdbdde8cce473f7e0 decimals 18 symbol USDC name USD Coin
	done!
