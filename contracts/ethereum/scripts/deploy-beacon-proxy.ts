import hre from 'hardhat'
import { mustEnv } from '../script-utils';
import type { ethers } from 'ethers';

const ENV_ORACLE = `FLU_ETHEREUM_ORACLE_ADDRESS`;

const ENV_TOKEN_BACKEND = `FLU_ETHEREUM_TOKEN_BACKEND`;

const ENV_BEACON_POOL = `FLU_ETHEREUM_BEACON_POOL`;
const ENV_BEACON_TOKEN = `FLU_ETHEREUM_BEACON_TOKEN`;

const ENV_AAVE_ATOKEN = `FLU_ETHEREUM_AAVE_ATOKEN_ADDRESS`;
const ENV_AAVE_ADDRESS_PROVIDER = `FLU_ETHEREUM_AAVE_PROVIDER_ADDRESS`;

const ENV_COMPOUND_CTOKEN = `FLU_ETHEREUM_COMPOUND_CTOKEN_ADDRESS`;

const ENV_DECIMALS = `FLU_ETHEREUM_DECIMALS`;
const ENV_SYMBOL = `FLU_ETHEREUM_TOKEN_SYMBOL`;
const ENV_NAME = `FLU_ETHEREUM_TOKEN_NAME`;

const main = async () => {
    const backend = mustEnv(ENV_TOKEN_BACKEND);

    const poolAddress = mustEnv(ENV_BEACON_POOL);
    const tokenAddress = mustEnv(ENV_BEACON_TOKEN);

    const tokenFactory = await hre.ethers.getContractFactory("Token");
    const compoundFactory = await hre.ethers.getContractFactory("CompoundLiquidityProvider");
    const aaveFactory = await hre.ethers.getContractFactory("AaveLiquidityProvider");

    console.log(`deploying token with beacon address ${tokenAddress}`);
    const token = await hre.upgrades.deployBeaconProxy(
        tokenAddress,
        tokenFactory,
    );
    console.log(`token deployed to address ${token.address}`);

    let pool: ethers.Contract;

    if (backend === "compound") {
        const cToken = mustEnv(ENV_COMPOUND_CTOKEN);
        console.log(`deploying compound pool with beacon ${poolAddress}, ctoken ${cToken}`);
        pool = await hre.upgrades.deployBeaconProxy(
            poolAddress,
            compoundFactory,
            [cToken, token.address],
        );
    } else if (backend === "aave") {
        const aToken = mustEnv(ENV_AAVE_ATOKEN);
        const aavePool = mustEnv(ENV_AAVE_ADDRESS_PROVIDER);
        console.log(`deploying aave pool with beacon ${poolAddress}, atoken ${aToken}, aave pool ${aavePool}`);
        pool = await hre.upgrades.deployBeaconProxy(
            poolAddress,
            aaveFactory,
            [aavePool, aToken, token.address],
        );
    } else {
        throw new Error(`Invalid token backend: ${backend} - should be 'compound' or 'aave'`);
    }
    await pool.deployed();
    console.log(`liquidity pool deployed to address ${pool.address}`);

    const oracle = mustEnv(ENV_ORACLE);
    const decimals = mustEnv(ENV_DECIMALS);
    const symbol = mustEnv(ENV_SYMBOL);
    const name = mustEnv(ENV_NAME);

    console.log(`initialising token with oracle ${oracle} decimals ${decimals} symbol ${symbol} name ${name}`);

    await token.deployed();
    await token.functions.init(
        pool.address,
        decimals,
        name,
        symbol,
        oracle,
    );
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);
