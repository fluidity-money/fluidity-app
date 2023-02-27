
import * as hre from "hardhat";

import type {
  FluidityFactories,
  FluidityContracts,
  FluidityBeaconAddresses,
  FluiditySigners,
  FluidityBindings } from "../types";

import {
  deployFluidity,
  deployBeacons } from "../deployment";

export let commonFactories: FluidityFactories;

export let commonContracts: FluidityContracts;

export let commonBeaconAddresses: FluidityBeaconAddresses;

export let signers: FluiditySigners;

export let commonBindings: FluidityBindings;

before(async function () {
  if (!process.env.FLU_FORKNET_NETWORK) {
    throw new Error(
      `no forknet network set! set FLU_FORKNET_NETWORK=goerli or mainnet if we're on a fork!`
    );
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

  const govTokenFactory = await hre.ethers.getContractFactory("GovToken");

  const veGovLockupFactory = await hre.ethers.getContractFactory("VEGovLockup");

  const registryFactory = await hre.ethers.getContractFactory("Registry");

  const operatorFactory = await hre.ethers.getContractFactory("Operator");

  const tokenFactory = await hre.ethers.getContractFactory("Token");

  const compoundLiquidityProviderFactory = await hre.ethers.getContractFactory(
    "CompoundLiquidityProvider"
  );

  const aaveV2LiquidityProviderFactory = await hre.ethers.getContractFactory(
    "AaveV2LiquidityProvider"
  );

  const aaveV3LiquidityProviderFactory = await hre.ethers.getContractFactory(
    "AaveV3LiquidityProvider"
  );

  const daoFactory = await hre.ethers.getContractFactory("DAOV1");

  commonFactories = {
    token: tokenFactory,
    govToken: govTokenFactory,
    veGovLockup: veGovLockupFactory,
    registry: registryFactory,
    operator: operatorFactory,
    compoundLiquidityProvider: compoundLiquidityProviderFactory,
    aaveV2LiquidityProvider: aaveV2LiquidityProviderFactory,
    aaveV3LiquidityProvider: aaveV3LiquidityProviderFactory,
    dao: daoFactory,
  };

  const [
    tokenBeacon,
    compoundLiquidityProviderBeacon,
    aaveV2LiquidityProviderBeacon,
    aaveV3LiquidityProviderBeacon,
    registryBeacon,
    operatorBeacon
  ] = await deployBeacons(
    hre,
    tokenFactory,
    compoundLiquidityProviderFactory,
    aaveV2LiquidityProviderFactory,
    aaveV3LiquidityProviderFactory,
    registryFactory,
    operatorFactory
  );

  commonBeaconAddresses = {
    token: tokenBeacon.address,
    compoundLiquidityProvider: compoundLiquidityProviderBeacon.address,
    aaveV2LiquidityProvider: aaveV2LiquidityProviderBeacon.address,
    aaveV3LiquidityProvider: aaveV3LiquidityProviderBeacon.address,
    registry: registryBeacon.address,
    operator: operatorBeacon.address
  };

  const {
    operator,
    govToken,
    registry,
    dao,
    veGovLockup
  } = await deployFluidity(
    hre,
    councilAddress,
    "Fluidity Money Token",
    "FLUID",
    18,
    1,

    registryFactory,
    operatorFactory,
    govTokenFactory,
    veGovLockupFactory,
    daoFactory,

    registryBeacon.address,
    operatorBeacon.address
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
