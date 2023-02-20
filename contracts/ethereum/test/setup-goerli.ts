import { ethers } from "ethers";
import * as hre from "hardhat";
import { deployTokens, forknetTakeFunds } from "../script-utils";
import { AAVE_V3_GOERLI_POOL_PROVIDER_ADDR, GoerliTokenList } from "../test-constants";
import {
    commonBeacons, commonBindings,
    commonContracts,
    commonFactories, signers
} from "./setup-common";


export let contracts: typeof commonContracts & {
  usdc: {
    deployedToken: ethers.Contract,
    deployedPool: ethers.Contract,
  },
};

export let bindings: typeof commonBindings & {
    usdc: {
      base: ethers.Contract,
      fluid: ethers.Contract,
    },
};

before(async function() {
  if (process.env.FLU_FORKNET_NETWORK !== "goerli") {
    console.log("not on a goerli fork! skipping aave v3 tests!");
    return;
  }

  const toDeploy = [GoerliTokenList["usdc"]];

  // deploy fUsdc
  await forknetTakeFunds(hre, [await signers.userAccount1.getAddress()], [GoerliTokenList["usdc"]]);

  const { tokenFactory, compoundFactory, aaveV2Factory, aaveV3Factory } =
    commonFactories;

  const { tokenBeacon, compoundBeacon, aaveV2Beacon, aaveV3Beacon } =
    commonBeacons;

  const {tokens} = await deployTokens(
    hre,
    toDeploy,
    "no v2 tokens here",
    AAVE_V3_GOERLI_POOL_PROVIDER_ADDR,
    signers.token.emergencyCouncil,
    signers.token.externalOperator,
    commonBindings.operator.externalOperator,
    commonBindings.registry.externalOperator,
    signers.token.externalOracle,

    tokenFactory,
    tokenBeacon,
    compoundFactory,
    compoundBeacon,
    aaveV2Factory,
    aaveV2Beacon,
    aaveV3Factory,
    aaveV3Beacon
  );

  contracts = {
    ...commonContracts,
    usdc: tokens["fUsdc"],
  };
  bindings = {
    ...commonBindings,
    usdc: {
      base: await hre.ethers.getContractAt("IERC20", GoerliTokenList["usdc"].address, signers.userAccount1),
      fluid: contracts.usdc.deployedToken.connect(signers.userAccount1),
    }
  };
});
