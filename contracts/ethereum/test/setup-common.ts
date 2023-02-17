import { ethers } from "ethers";
import * as hre from "hardhat";

import {
  deployOperator,
  deployDAO,
  deployGovToken,
  deployRegistry,
  deployVEGovLockup,
  deployBeacons,
  deployFactories
  } from "../script-utils";

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

export let commonFactories: {
  tokenFactory: ethers.ContractFactory,
  compoundFactory: ethers.ContractFactory,
  aaveV2Factory: ethers.ContractFactory,
  aaveV3Factory: ethers.ContractFactory
};

export let commonBeacons: {
  tokenBeacon: ethers.Contract,
  compoundBeacon: ethers.Contract,
  aaveV2Beacon: ethers.Contract,
  aaveV3Beacon: ethers.Contract
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
    rewardPoolsOperatorSigner,
    govTokenOwnerSigner,
    fwEthAccountSigner
  ] = await hre.ethers.getSigners();

  let govToken = await deployGovToken(hre, govTokenOwnerSigner);

  let veGov = await deployVEGovLockup(hre, operatorCouncilSigner, govToken.address);

  let dao = await deployDAO(hre, operatorCouncilSigner, veGov);

  const [tokenFactory, compoundFactory, aaveV2Factory, aaveV3Factory] =
    await deployFactories(hre);

  console.log("factories");

  let [tokenBeacon, compoundBeacon, aaveV2Beacon, aaveV3Beacon] = await deployBeacons(
    hre,
    tokenFactory,
    compoundFactory,
    aaveV2Factory,
    aaveV3Factory
  );

  console.log("beacons");

  let registry = await deployRegistry(
    hre,
    dao,
    tokenBeacon,
    compoundBeacon,
    aaveV2Beacon,
    aaveV3Beacon
  );

  console.log("registry");

  let operator = await deployOperator(
    hre,
    operatorOperatorSigner,
    operatorCouncilSigner,
    registry
  );

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

  commonFactories = {
    tokenFactory,
    compoundFactory,
    aaveV2Factory,
    aaveV3Factory
  };

  commonBeacons = {
    tokenBeacon,
    compoundBeacon,
    aaveV2Beacon,
    aaveV3Beacon
  };
});
