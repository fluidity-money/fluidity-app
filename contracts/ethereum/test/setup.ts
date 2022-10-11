import { ethers } from "ethers";
import * as hre from "hardhat";
import { deployTokens, deployWorkerConfig, forknetTakeFunds } from "../script-utils";
import { AAVE_POOL_PROVIDER_ADDR, TokenList } from "../test-constants";

export let usdtAddr: string;
export let fUsdtAddr: string;

export let feiAddr: string;
export let fFeiAddr: string;

export let daiAddr: string;
export let fDaiAddr: string;

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

before(async () => {
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
  accountAddr = await accountSigner.getAddress()

  const toDeploy = [TokenList["usdt"], TokenList["fei"], TokenList["dai"]];

  await forknetTakeFunds(
    hre,
    [accountSigner],
    toDeploy,
  );

  configAddr = await deployWorkerConfig(
    hre,
    await configOperatorSigner.getAddress(),
    await configCouncilSigner.getAddress(),
  );

  const { tokens } = await deployTokens(
    hre,
    toDeploy,
    AAVE_POOL_PROVIDER_ADDR,
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
    .map(t => [t[0].address, tokenOracleAddress]);

  await configOperator.updateOracles(oracles);

  usdtAddr = TokenList["usdt"].address;
  fUsdtAddr = tokens.fUSDt[0].address;

  feiAddr = TokenList["fei"].address;
  fFeiAddr = tokens.fFei[0].address;

  daiAddr = TokenList["dai"].address;
  fDaiAddr = tokens.fDAI[0].address;

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
