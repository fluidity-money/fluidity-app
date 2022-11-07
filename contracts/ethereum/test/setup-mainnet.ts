import { ethers } from "ethers";
import * as hre from "hardhat";
import { deployTokens, forknetTakeFunds } from "../script-utils";
import { AAVE_V2_POOL_PROVIDER_ADDR, TokenList } from "../test-constants";

import { configAddr, tokenOracleSigner, tokenOperatorSigner, tokenCouncilSigner, configOperatorSigner, configCouncilSigner, accountSigner, account2Signer } from './setup-common';

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

export let configOperator: ethers.Contract;
export let configCouncil: ethers.Contract;

before(async function () {
  if (process.env.FLU_FORKNET_GOERLI === "true") {
    console.log("on goerli! only running aave v3 tests!");
    return;
  }

  const toDeploy = [TokenList["usdt"], TokenList["fei"], TokenList["dai"]];

  await forknetTakeFunds(
    hre,
    [accountSigner],
    toDeploy,
  );

  const { tokens } = await deployTokens(
    hre,
    toDeploy,
    AAVE_V2_POOL_PROVIDER_ADDR,
    "no v3 tokens here",
    await tokenCouncilSigner.getAddress(),
    await tokenOperatorSigner.getAddress(),
    configAddr,
  );

  configOperator = await hre.ethers.getContractAt(
    "WorkerConfig",
    configAddr,
    configOperatorSigner,
  );
  configCouncil = await hre.ethers.getContractAt(
    "WorkerConfig",
    configAddr,
    configCouncilSigner,
  );

  const tokenOracleAddress = await tokenOracleSigner.getAddress();

  const oracles = Object.values(tokens)
    .map(t => [t.deployedToken.address, tokenOracleAddress]);

  await configOperator.updateOracles(oracles);

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
  fUsdtOperator = await hre.ethers.getContractAt("Token", fUsdtAddr, tokenOperatorSigner);
  fUsdtCouncil = await hre.ethers.getContractAt("Token", fUsdtAddr, tokenCouncilSigner);
});
