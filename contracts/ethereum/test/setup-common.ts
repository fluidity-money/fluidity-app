
/*
 * Set up the factories, deploy everything with the default testing
 * parameters, point each upgradeable beacon to a specific proxy admin,
 * then set the owner to the dao
 */

import * as hre from "hardhat";

import type {
  FluidityFactories,
  FluidityContracts,
  FluidityBeaconAddresses,
  FluiditySigners,
  FluidityBindings } from "../types";

import {
  getFactories,
  deployFluidity,
  deployBeacons} from "../deployment";

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
    govTokenExtraSigner1,
    govTokenExtraSigner2,
    fwEthAccountSigner,
    veGovSigner,
    registrySigner,
    blacklistedSigner
  ] = await hre.ethers.getSigners();

  const councilAddress = await operatorCouncilSigner.getAddress();

  commonFactories = await getFactories(hre);

  const {
    upgradeableBeacon: upgradeableBeaconFactory,
    token: tokenFactory,
    govToken: govTokenFactory,
    veGovToken: veGovTokenFactory,
    registry: registryFactory,
    operator: operatorFactory,
    compoundLiquidityProvider: compoundLiquidityProviderFactory,
    aaveV2LiquidityProvider: aaveV2LiquidityProviderFactory,
    aaveV3LiquidityProvider: aaveV3LiquidityProviderFactory,
    dao: daoFactory,
    permitRouterV1: permitRouterV1Factory
  } = commonFactories;

  const beacons = await deployBeacons(
    upgradeableBeaconFactory,
    account1Signer.address,
    tokenFactory,
    compoundLiquidityProviderFactory,
    operatorFactory,
    aaveV2LiquidityProviderFactory,
    aaveV3LiquidityProviderFactory,
    registryFactory
  );

  const [
    tokenBeacon,
    compoundLiquidityProviderBeacon,
    operatorBeacon,
    aaveV2LiquidityProviderBeacon,
    aaveV3LiquidityProviderBeacon,
    registryBeacon,
  ] = beacons;

  commonBeaconAddresses = {
    token: tokenBeacon.address,
    compoundLiquidityProvider: compoundLiquidityProviderBeacon.address,
    aaveV2LiquidityProvider: aaveV2LiquidityProviderBeacon.address,
    aaveV3LiquidityProvider: aaveV3LiquidityProviderBeacon.address,
    registry: registryBeacon.address,
    operator: operatorBeacon.address
  };

  commonContracts = await deployFluidity(
    hre,
    councilAddress,

    "Fluidity Money Token",
    "FLUID",
    18,
    10000000,

    registryFactory,
    registrySigner,

    operatorFactory,
    operatorOperatorSigner,

    govTokenFactory,
    govTokenOwnerSigner,

    veGovTokenFactory,
    veGovSigner,

    daoFactory,

    registryBeacon.address,
    operatorBeacon.address,

    permitRouterV1Factory
  );

  const {
    operator,
    govToken,
    registry,
    dao,
    veGovToken,
    permitRouterV1
  } = commonContracts;

  signers = {
    userAccount1: account1Signer,
    userAccount2: account2Signer,
    fwEthAccount: fwEthAccountSigner,

    token: {
      emergencyCouncil: tokenCouncilSigner,
      externalOperator: tokenOperatorSigner,
      externalOracle: externalOracleSigner,
      blacklistedSigner: blacklistedSigner,
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
      extraSigner1: govTokenExtraSigner1,
      extraSigner2: govTokenExtraSigner2
    },

    veGovToken: {
      owner: veGovSigner
    }
  };

  // transfer ownership of all the deployed beacons to the dao itself

  await Promise.all(beacons.map((b) => b.transferOwnership(dao.address)));

  commonBindings = {
    operator: {
      emergencyCouncil: operator.connect(operatorCouncilSigner),
      externalOperator: operator.connect(operatorOperatorSigner),
    },
    registry: {
      externalOperator: registry.connect(registrySigner)
    },
    govToken: {
      owner: govToken.connect(govTokenOwnerSigner),
    },
    veGovToken: {
      spender: veGovToken.connect(veGovSigner)
    },
    permitRouterV1: {
      operator: permitRouterV1.connect(operatorOperatorSigner)
    }
  };
});
