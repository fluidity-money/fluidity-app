import { ethers } from "ethers";
import * as hre from "hardhat";

import {
  FluidityFactories,
  FluidityContracts } from "../script-utils";

export let commonFactories: FluidityContracts;

export let commonContracts: FluidityFactories;

export let signers: {
  userAccount1: ethers.Signer,
  userAccount2: ethers.Signer,
  fwEthAccount: ethers.Signer,

  token: {
    emergencyCouncil: ethers.Signer,
    externalOperator: ethers.Signer,
    externalOracle: ethers.Signer,
  },
  operator: {
    emergencyCouncil: ethers.Signer,
    externalOperator: ethers.Signer,
  },
  registry: {
    externalOperator: ethers.Signer
  },
  govToken: {
    owner: ethers.Signer,
  }
};

export let commonBindings: {
  operator: {
    emergencyCouncil: ethers.Contract,
    externalOperator: ethers.Contract,
  },
  registry: {
    externalOperator: ethers.Contract
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
    externalOracleSigner,
    tokenCouncilSigner,
    tokenOperatorSigner,
    operatorCouncilSigner,
    operatorOperatorSigner,
    govTokenOwnerSigner,
    fwEthAccountSigner
  ] = await hre.ethers.getSigners();

  const councilAddress = await operatorCouncilSigner.getAddress();

  commonFactories = {
    govToken: await hre.ethers.getContractFactory("GovToken"),
    veGovLockup: await hre.ethers.getContractFactory("VEGovLockup"),
    registry: await hre.ethers.getContractFactory("Registry"),
    operator: await hre.ethers.getContractFactory("Operator"),
    token: await hre.ethers.getContractFactory("Token"),
    compoundLiquidityProvider: await hre.ethers.getContractFactory("CompoundLiquidityProvider"),
    aaveV2LiquidityProvider: await hre.ethers.getContractFactory("AaveV2LiquidityProvider"),
    aaveV3LiquidityProvider: await hre.ethers.getContractFactory("AaveV3LiquidityProvider"),
    dao: await hre.ethers.getContractFactory("DAOV1")
  };

  signers = {
    userAccount1: account1Signer,
    userAccount2: account2Signer,
    fwEthAccount: fwEthAccountSigner,

    token: {
      emergencyCouncil: tokenCouncilSigner,
      externalOperator: tokenOperatorSigner,
      externalOracle: externalOracleSigner,
    },

    operator: {
      emergencyCouncil: operatorCouncilSigner,
      externalOperator: operatorOperatorSigner,
    },

    registry: {
      externalOperator: operatorOperatorSigner
    },

    govToken: {
      owner: govTokenOwnerSigner,
    },
  };

  commonContracts = {
    operator,
    govToken,
    registry,
    dao,
    veGovLockup
  };

  commonBindings = {
    operator: {
      emergencyCouncil: operator.connect(operatorCouncilSigner),
      externalOperator: operator.connect(operatorOperatorSigner),
    },
    registry: {
      externalOperator: registry.connect(operatorOperatorSigner)
    },
    govToken: {
      owner: govToken.connect(govTokenOwnerSigner),
    }
  };
});
