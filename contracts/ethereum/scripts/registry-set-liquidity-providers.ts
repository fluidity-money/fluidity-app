
import * as hre from "hardhat";

import { mustEnv } from "../script-utils";

const ENV_REGISTRY = `FLU_ETHEREUM_REGISTRY`;

const ENV_LIQUIDITY_PROVIDERS = `FLU_ETHEREUM_LIQUIDITY_PROVIDERS`;

const main = async () => {
  const registryAddress = mustEnv(ENV_REGISTRY);

  const liquidityProviders = mustEnv(ENV_LIQUIDITY_PROVIDERS).split(",");

  const registry = await hre.ethers.getContractAt("Registry", registryAddress);

  const tx = await registry.registerManyLiquidityProviders(liquidityProviders);

  console.log(
    `Updated ${registryAddress} to add the LPs ${liquidityProviders} with tx ${tx.hash}`
  );
};

main().then(() => console.log("done"));
