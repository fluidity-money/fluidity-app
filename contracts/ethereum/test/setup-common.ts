import { ethers } from "ethers";
import * as hre from "hardhat";

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

export let commonFactories: {
  govToken: ethers.ContractFactory,
  veGovLockup: ethers.ContractFactory,
  registry: ethers.ContractFactory,
  operator: ethers.ContractFactory,
  token: ethers.ContractFactory,
  compoundLiquidityProvider: ethers.ContractFactory,
  aaveV2LiquidityProvider: ethers.ContractFactory,
  aaveV3LiquidityProvider: ethers.ContractFactory,
  dao: ethers.ContractFactory,
  fluidityV1: ethers.ContractFactory
};

export let commonImpls: {
  govToken: ethers.Contract,
  veGovLockup: ethers.Contract,
  registry: ethers.Contract,
  operator: ethers.Contract,
  token: ethers.Contract,
  compoundLiquidityProvider: ethers.Contract,
  aaveV2LiquidityProvider: ethers.Contract,
  aaveV3LiquidityProvider: ethers.Contract
};

export let commonContracts: {
  operator: ethers.Contract,
  govToken: ethers.Contract,
  registry: ethers.Contract,
  dao: ethers.Contract,
  veGovLockup: ethers.Contract,
  tokenBeacon: ethers.Contract,
  compoundLiquidityProviderBeacon: ethers.Contract,
  aaveV2LiquidityProviderBeacon: ethers.Contract,
  aaveV3LiquidityProviderBeacon: ethers.Contract
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
    dao: await hre.ethers.getContractFactory("DAOV1"),
    fluidityV1: await hre.ethers.getContractFactory("FluidityV1")
  };

  commonImpls = {
    govToken: await commonFactories.govToken.deploy(),
    veGovLockup: await commonFactories.veGovLockup.deploy(),
    registry: await commonFactories.registry.deploy(),
    operator: await commonFactories.operator.deploy(),
    token: await commonFactories.token.deploy(),
    compoundLiquidityProvider: await commonFactories.compoundLiquidityProvider.deploy(),
    aaveV2LiquidityProvider: await commonFactories.aaveV2LiquidityProvider.deploy(),
    aaveV3LiquidityProvider: await commonFactories.aaveV3LiquidityProvider.deploy()
  };

  const fluidity = await commonFactories.fluidityV1.deploy(
    councilAddress,
    "Fluidity Money",
    "FLUID",
    18,
    1000000,
    {
      govToken: commonImpls.govToken.address,
      veGovLockup: commonImpls.veGovLockup.address,
      registry: commonImpls.registry.address,
      operator: commonImpls.operator.address,
      token: commonImpls.token.address,
      aaveV2LiquidityProvider: commonImpls.aaveV2LiquidityProvider.address,
      aaveV3LiquidityProvider: commonImpls.aaveV3LiquidityProvider.address
    }
  );

  console.log("yolo");

  const govToken = commonFactories.govToken.attach(
    await fluidity.govToken()
  );

  const veGovLockup = commonFactories.veGovLockup.attach(
    await fluidity.veGovLockup()
  );

  const registry = commonFactories.registry.attach(await fluidity.registry());

  const operator = commonFactories.operator.attach(await fluidity.operator());

  const dao = commonFactories.dao.attach(await fluidity.dao());

  const tokenBeacon = await fluidity.tokenBeacon();

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
    veGovLockup,
    tokenBeacon,
    compoundLiquidityProviderBeacon,
    aaveV2LiquidityProviderBeacon,
    aaveV3LiquidityProviderBeacon
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
