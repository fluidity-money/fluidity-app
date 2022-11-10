import { ethers } from "ethers";
import * as hre from "hardhat";
import { deployTokens, deployWorkerConfig, forknetTakeFunds } from "../script-utils";
import { AAVE_V2_POOL_PROVIDER_ADDR, TokenList } from "../test-constants";

export let configAddr: string;

export let accountAddr: string;
export let accountSigner: ethers.Signer;
export let account2Signer: ethers.Signer;
export let deploySigner: ethers.Signer;
export let tokenOracleSigner: ethers.Signer;
export let tokenOperatorSigner: ethers.Signer;
export let tokenCouncilSigner: ethers.Signer;
export let configOperatorSigner: ethers.Signer;
export let configCouncilSigner: ethers.Signer;

before(async function () {
  [
    accountSigner,
    account2Signer,
    deploySigner,
    tokenOracleSigner,
    tokenOperatorSigner,
    tokenCouncilSigner,
    configOperatorSigner,
    configCouncilSigner,
  ] = await hre.ethers.getSigners();

  accountAddr = await accountSigner.getAddress();

  configAddr = await deployWorkerConfig(
    hre,
    await configOperatorSigner.getAddress(),
    await configCouncilSigner.getAddress(),
  );
});
