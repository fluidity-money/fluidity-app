
import * as hre from "hardhat";

import { mustEnv } from "../script-utils";

const ENV_REGISTRY = `FLU_ETHEREUM_REGISTRY`;

const ENV_TOKENS = `FLU_ETHEREUM_TOKENS`;

const main = async () => {
  const registryAddress = mustEnv(ENV_REGISTRY);

  const tokens = mustEnv(ENV_TOKENS).split(",");

  const registry = await hre.ethers.getContractAt("Registry", registryAddress);

  const tx = await registry.registerManyTokens(tokens);

  console.log(
    `Updated ${registryAddress} to add the tokens ${tokens} with tx ${tx.hash}`
  );
};

main().then(() => console.log("done"));
