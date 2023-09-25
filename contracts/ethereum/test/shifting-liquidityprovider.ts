
import * as hre from "hardhat";

import {
  AAVE_V2_POOL_PROVIDER_ADDR,
  AUSDT_ADDR } from "../mainnet-constants";

import { bindings, contracts } from "./setup-mainnet";

describe("token liquidity provider swapping", async function () {
  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet")
      return this.skip();
  });

  it("should support swapping from compound to aave v2", async function () {
    const newProviderFactory = await hre.ethers.getContractFactory("AaveV2LiquidityProvider");
    const newProvider = await newProviderFactory.deploy();

    await newProvider.init(
      AAVE_V2_POOL_PROVIDER_ADDR,
      AUSDT_ADDR,
      contracts.usdt.deployedToken.address,
    );

    const newProviderAddress = newProvider.address;

    const { usdt: { externalOperator: usdt } } = bindings;

    const { usdt: { deployedPool: deployedPoolUsdt } } = contracts;

    const poolAmount = await deployedPoolUsdt.callStatic.totalPoolAmount();

    const oldProviderAddress = deployedPoolUsdt.address;

    await usdt.upgradeLiquidityProvider(newProviderAddress, poolAmount);

    await usdt.upgradeLiquidityProvider(oldProviderAddress, poolAmount);
  });
});
