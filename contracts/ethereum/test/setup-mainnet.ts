import { ethers } from "ethers";
import * as hre from "hardhat";
import { deployTokens, deployRewardPools, forknetTakeFunds } from "../script-utils";
import { AAVE_V2_POOL_PROVIDER_ADDR, TokenList } from "../test-constants";

import {
  operatorAddr,
  tokenOracleSigner,
  externalOperatorSigner,
  tokenCouncilSigner,
  configOperatorSigner,
  configCouncilSigner,
  rewardPoolsOperatorSigner,
  accountSigner,
  account2Signer } from './setup-common';

export let usdtAddr: string;
export let fUsdtAddr: string;

export let feiAddr: string;
export let fFeiAddr: string;

export let daiAddr: string;
export let fDaiAddr: string;

export let usdtAccount: ethers.Contract
export let fUsdtAccount: ethers.Contract;
export let fUsdtAccount2: ethers.Contract;

export let feiAccount: ethers.Contract
export let fFeiAccount: ethers.Contract;

export let daiAccount: ethers.Contract;
export let fDaiAccount: ethers.Contract;

export let fUsdtOracle: ethers.Contract;
export let fUsdtOperator: ethers.Contract;
export let fUsdtCouncil: ethers.Contract;

export let operatorOperator: ethers.Contract;
export let operatorCouncil: ethers.Contract;

export let rewardPoolsOperator: ethers.Contract;

before(async function () {
  if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
    console.log("not on a mainnet fork! skipping most tests!");
    return;
  }

  const toDeploy = [TokenList["usdt"], TokenList["fei"], TokenList["dai"]];

  await forknetTakeFunds(
    hre,
    [await accountSigner.getAddress()],
    toDeploy,
  );

  console.log("signer" + externalOperatorSigner)
  console.log("addr" + await externalOperatorSigner.getAddress())
  const { tokens } = await deployTokens(
    hre,
    toDeploy,
    AAVE_V2_POOL_PROVIDER_ADDR,
    "no v3 tokens here",
    await tokenCouncilSigner.getAddress(),
    operatorAddr,
    await externalOperatorSigner.getAddress(),
  );

  operatorOperator = await hre.ethers.getContractAt(
    "Operator",
    operatorAddr,
    externalOperatorSigner,
  );

  operatorCouncil = await hre.ethers.getContractAt(
    "Operator",
    operatorAddr,
    configCouncilSigner,
  );

  const tokenOracleAddress = await tokenOracleSigner.getAddress();

  const oracles = Object.values(tokens)
    .map(t => [t.deployedToken.address, tokenOracleAddress]);

  await operatorOperator.updateOracles(oracles);

  usdtAddr = TokenList["usdt"].address;
  fUsdtAddr = tokens.fUSDt.deployedToken.address;

  feiAddr = TokenList["fei"].address;
  fFeiAddr = tokens.fFei.deployedToken.address;

  daiAddr = TokenList["dai"].address;
  fDaiAddr = tokens.fDAI.deployedToken.address;

  usdtAccount = await hre.ethers.getContractAt("IERC20", usdtAddr, accountSigner);
  fUsdtAccount = await hre.ethers.getContractAt("Token", fUsdtAddr, accountSigner);
  fUsdtAccount2 = await hre.ethers.getContractAt("Token", fUsdtAddr, account2Signer);

  feiAccount = await hre.ethers.getContractAt("IERC20", feiAddr, accountSigner);
  fFeiAccount = await hre.ethers.getContractAt("Token", fFeiAddr, accountSigner);

  daiAccount = await hre.ethers.getContractAt("IERC20", daiAddr, accountSigner);
  fDaiAccount = await hre.ethers.getContractAt("Token", fDaiAddr, accountSigner);

  fUsdtOracle = await hre.ethers.getContractAt("Token", fUsdtAddr, tokenOracleSigner);
  fUsdtOperator = await hre.ethers.getContractAt("Token", fUsdtAddr, externalOperatorSigner);
  fUsdtCouncil = await hre.ethers.getContractAt("Token", fUsdtAddr, tokenCouncilSigner);

  rewardPoolsOperator = await deployRewardPools(
    hre,
    await rewardPoolsOperatorSigner.getAddress(),
    [
      fUsdtAddr,
      fFeiAddr,
      fDaiAddr
    ]
  );
});
