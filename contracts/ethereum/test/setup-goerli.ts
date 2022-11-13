import * as hre from "hardhat";
import { ethers } from "ethers";
import { deployTokens, forknetTakeFunds, Token } from "../script-utils";
import { AAVE_V3_GOERLI_POOL_PROVIDER_ADDR, GoerliTokenList } from "../test-constants";
import { accountSigner, configAddr, tokenCouncilSigner, tokenOperatorSigner } from "./setup-common";

export let usdcAccount: ethers.Contract;
export let fAUsdcAccount: ethers.Contract;

before(async function() {
  if (process.env.FLU_FORKNET_NETWORK !== "goerli") {
    console.log("not on a goerli fork! skipping aave v3 tests!");
    return;
  }

  const toDeploy = [GoerliTokenList["usdc"]];

  // deploy fUsdc
  await forknetTakeFunds(hre, [accountSigner], [GoerliTokenList["usdc"]]);

  const {tokens} = await deployTokens(
    hre,
    toDeploy,
    "no v2 tokens here",
    AAVE_V3_GOERLI_POOL_PROVIDER_ADDR,
    await tokenCouncilSigner.getAddress(),
    await tokenOperatorSigner.getAddress(),
    configAddr,
  );

  let usdcAddr = GoerliTokenList.usdc.address;
  let fAUsdcAddr = tokens.fUsdc.deployedToken.address;
  usdcAccount = await hre.ethers.getContractAt("IERC20", usdcAddr, accountSigner);
  fAUsdcAccount = await hre.ethers.getContractAt("Token", fAUsdcAddr, accountSigner);
});
