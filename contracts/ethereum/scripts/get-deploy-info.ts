// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import hre from 'hardhat'
import { mustEnv } from '../script-utils';

const ENV_TOKEN_BACKEND = `FLU_ETHEREUM_TOKEN_BACKEND`;
const ENV_LIQUIDITY_TOKEN_ADDRESS = `FLU_ETHEREUM_LIQUIDITY_TOKEN_ADDRESS`;

const main = async () => {
    const [signer] = await hre.ethers.getSigners();
    const backend = mustEnv(ENV_TOKEN_BACKEND);
    const liquidityTokenAddress = mustEnv(ENV_LIQUIDITY_TOKEN_ADDRESS);

    let underlyingAddress;
    let liquidityToken;

    if (backend === 'compound') {
        liquidityToken = await hre.ethers.getContractAt(
            liquidityTokenAddress,
            "CERC20Interface",
            signer,
        );
        underlyingAddress = await liquidityToken.callStatic.underlying();
    } else if (backend === 'aave') {
        liquidityToken = await hre.ethers.getContractAt(
            liquidityTokenAddress,
            "ATokenInterface",
            signer,
        );
        underlyingAddress = await liquidityToken.callStatic.UNDERLYING_ASSET_ADDRESS();
    } else {
        throw new Error(`Invalid token backend: ${backend} - should be 'compound' or 'aave'`);
    }

    const underlying = await hre.ethers.getContractAt(
        underlyingAddress,
        "IERC20",
        signer,
    );

    const name = await underlying.callStatic.name();
    const symbol = await underlying.callStatic.symbol();
    const decimals = await underlying.callStatic.decimals();

    console.log(`FLU_ETHEREUM_TOKEN_BACKEND=${backend}`);
    if (backend === 'aave') {
        console.log(`FLU_ETHEREUM_AAVE_ATOKEN_ADDRESS=${liquidityTokenAddress}`);

        const lendingPoolAddress = await liquidityToken.callStatic.POOL();
        const lendingPool = await hre.ethers.getContractAt(
            lendingPoolAddress,
            "LendingPoolAddressesProviderInterface",
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
