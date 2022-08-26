import { ethers } from "ethers";
import * as hre from "hardhat";
import { deployTokens, forknetTakeFunds } from "../script-utils";
import { AAVE_POOL_PROVIDER_ADDR, TokenList } from "../test-constants";

export let usdt_addr: string;
export let fusdt_addr: string;

export let fei_addr: string;
export let ffei_addr: string;

export let fdai_addr: string;

export let signer: ethers.Signer;
export let oracle: ethers.Signer;
export let emergencyCouncil: ethers.Signer;
export let operator: ethers.Signer;

before(async () => {
  [signer, oracle, emergencyCouncil, operator] =
    await hre.ethers.getSigners();

  const toDeploy = [TokenList["usdt"], TokenList["fei"], TokenList["dai"]];

  await forknetTakeFunds(
    hre,
    [signer],
    toDeploy,
  );

  const { tokens } = await deployTokens(
    hre,
    toDeploy,
    AAVE_POOL_PROVIDER_ADDR,
    await oracle.getAddress(),
    await emergencyCouncil.getAddress(),
    await operator.getAddress()
  );

  usdt_addr = TokenList["usdt"].address;
  fusdt_addr = tokens.fUSDt[0].address;

  fei_addr = TokenList["fei"].address;
  ffei_addr = tokens.fFei[0].address;

  fdai_addr = tokens.fDAI[0].address;
});
