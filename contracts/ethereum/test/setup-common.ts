import { ethers } from "ethers";
import * as hre from "hardhat";
import { deployOperator, deployGovToken } from "../script-utils";

export let signers: {
  userAccount1: ethers.Signer,
  userAccount2: ethers.Signer,

  token: {
    emergencyCouncil: ethers.Signer,
    externalOperator: ethers.Signer,
    externalOracle: ethers.Signer,
  },
  operator: {
    emergencyCouncil: ethers.Signer,
    externalOperator: ethers.Signer,
  },
  rewardPools: {
    externalOperator: ethers.Signer,
  },
  govToken: {
    owner: ethers.Signer,
  }
};

export let commonContracts: {
  operator: ethers.Contract,
  govToken: ethers.Contract,
};


export let commonBindings: {
  operator: {
    emergencyCouncil: ethers.Contract,
    externalOperator: ethers.Contract,
  },
  govToken: {
    owner: ethers.Contract,
  },
};

before(async function () {
  if (!process.env.FLU_FORKNET_NETWORK) {
    throw new Error(`no forknet network set! set FLU_FORKNET_NETWORK=goerli or mainnet if we're on a fork!`);
  }

  const [
    account1Signer,
    account2Signer,
    tokenCouncilSigner,
    tokenOperatorSigner,
    operatorCouncilSigner,
    operatorOperatorSigner,
    rewardPoolsOperatorSigner,
    govTokenOwnerSigner
  ] = await hre.ethers.getSigners();

  let operator = await deployOperator(
    hre,
    operatorOperatorSigner,
    operatorCouncilSigner,
  );
  let govToken = await deployGovToken(hre, govTokenOwnerSigner);

  signers = {
    userAccount1: account1Signer,
    userAccount2: account2Signer,
    token: {
      emergencyCouncil: tokenCouncilSigner,
      externalOperator: tokenOperatorSigner,
    },
    operator: {
      emergencyCouncil: operatorCouncilSigner,
      externalOperator: operatorOperatorSigner,
    },
    rewardPools: {
      externalOperator: rewardPoolsOperatorSigner,
    },
    govToken: {
      owner: govTokenOwnerSigner,
    },
  };
  commonContracts = {
    operator,
    govToken,
  };
  commonBindings = {
    operator: {
      emergencyCouncil: operator.connect(operatorCouncilSigner),
      externalOperator: operator.connect(operatorOperatorSigner),
    },
    govToken: {
      owner: govToken.connect(govTokenOwnerSigner),
    },
  };
});
