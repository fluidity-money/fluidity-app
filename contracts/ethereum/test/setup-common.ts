import { ethers } from "ethers";
import * as hre from "hardhat";
import { deployTokens, deployOperator, deployGovToken, forknetTakeFunds } from "../script-utils";
import { AAVE_V2_POOL_PROVIDER_ADDR, TokenList } from "../test-constants";

export let operatorAddr: string;

export let accountAddr: string;
export let accountSigner: ethers.Signer;
export let account2Signer: ethers.Signer;
export let deploySigner: ethers.Signer;
export let tokenOracleSigner: ethers.Signer;
export let externalOperatorSigner: ethers.Signer;
export let tokenCouncilSigner: ethers.Signer;
export let configOperatorSigner: ethers.Signer;
export let configCouncilSigner: ethers.Signer;
export let rewardPoolsOperatorSigner: ethers.Signer;
export let govOperatorSigner: ethers.Signer;
export let govTokenSigner: ethers.Signer;
export let govTokenAddr: string;

before(async function () {
  if (!process.env.FLU_FORKNET_NETWORK) {
    console.log(`no forknet network set! set FLU_FORKNET_NETWORK=goerli or mainnet if we're on a fork!`);
    this.skip();
  }

  for (const address of await hre.ethers.getSigners()) {
    await hre.network.provider.send(
      "hardhat_setBalance",
      [
        address.address,
        "0x1000000000000000000000000000000000000000000000000000000000000000",
      ],
    );
  }

  [
    accountSigner,
    account2Signer,
    deploySigner,
    tokenOracleSigner,
    externalOperatorSigner,
    tokenCouncilSigner,
    configOperatorSigner,
    configCouncilSigner,
    rewardPoolsOperatorSigner,
    govOperatorSigner
  ] = await hre.ethers.getSigners();

  accountAddr = await accountSigner.getAddress();

  let operator = await deployOperator(
    hre,
    await externalOperatorSigner.getAddress(),
    await configCouncilSigner.getAddress(),
  );
  operatorAddr = operator.address;

  govTokenAddr = await deployGovToken(hre, govOperatorSigner);
});
