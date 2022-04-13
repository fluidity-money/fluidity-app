import hre from 'hardhat'
import { mustEnv } from '../script-utils';
import type { ethers } from 'ethers';

const ENV_TOKEN_BACKEND = `FLU_ETHEREUM_TOKEN_BACKEND`;
const ENV_LIQUIDITY_TOKEN_ADDRESS = `FLU_ETHEREUM_LIQUIDITY_TOKEN_ADDRESS`;

const cTokenAbi = [
    'function underlying() returns (address)',
];
const aTokenAbi = [
    'function UNDERLYING_ASSET_ADDRESS() returns (address)',
    'function POOL() returns (address)',
];
const aLendingPoolAbi = [
    'function getAddressesProvider() returns (address)',
];
const erc20Abi = [
  'function name() returns (string)',
  'function symbol() returns (string)',
  'function decimals() returns (uint8)',
];

const main = async () => {
    const [signer] = await hre.ethers.getSigners();
    const backend = mustEnv(ENV_TOKEN_BACKEND);
    const liquidityTokenAddress = mustEnv(ENV_LIQUIDITY_TOKEN_ADDRESS);

    let underlyingAddress;
    let liquidityToken;

    if (backend === 'compound') {
        liquidityToken = new hre.ethers.Contract(
            liquidityTokenAddress,
            cTokenAbi,
            signer,
        );
        underlyingAddress = await liquidityToken.callStatic.underlying();
    } else if (backend === 'aave') {
        liquidityToken = new hre.ethers.Contract(
            liquidityTokenAddress,
            aTokenAbi,
            signer,
        );
        underlyingAddress = await liquidityToken.callStatic.UNDERLYING_ASSET_ADDRESS();
    } else {
        throw new Error(`Invalid token backend: ${backend} - should be 'compound' or 'aave'`);
    }

    const underlying = new hre.ethers.Contract(
        underlyingAddress,
        erc20Abi,
        signer,
    );

    const name = await underlying.callStatic.name();
    const symbol = await underlying.callStatic.symbol();
    const decimals = await underlying.callStatic.decimals();

    console.log(`FLU_ETHEREUM_TOKEN_BACKEND=${backend}`);
    if (backend === 'aave') {
        console.log(`FLU_ETHEREUM_AAVE_ATOKEN_ADDRESS=${liquidityTokenAddress}`);

        const lendingPoolAddress = await liquidityToken.callStatic.POOL();
        const lendingPool = new hre.ethers.Contract(
            lendingPoolAddress,
            aLendingPoolAbi,
            signer,
        );
        const addressesProviderAddress = await lendingPool.callStatic.getAddressesProvider();

        console.log(`FLU_ETHEREUM_AAVE_PROVIDER_ADDRESS=${addressesProviderAddress}`);
    } else if (backend === 'compound') {
        console.log(`FLU_ETHEREUM_COMPOUND_CTOKEN_ADDRESS=${liquidityTokenAddress}`);
    }

    console.log(`FLU_ETHEREUM_DECIMALS=${decimals}`);
    console.log(`FLU_ETHEREUM_TOKEN_SYMBOL=f${symbol}`);
    console.log(`FLU_ETHEREUM_TOKEN_NAME="Fluid ${name}"`);
}

main()
    .then(() => process.exit(0))
    .catch(console.error);
