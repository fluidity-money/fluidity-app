
import { ethers } from 'ethers';

export type Token = {
  decimals: number,
  name: string,
  symbol: string,
  address: string,
  owner: string
} & (
  {
    backend: 'compound',
    compoundAddress: string,
  } | {
    backend: 'aaveV2',
    aaveAddress: string,
  } | {
    backend: 'aaveV3',
    aaveAddress: string,
  }
);

export type FluidityContracts = {
  operator: ethers.Contract,
  govToken: ethers.Contract,
  registry: ethers.Contract,
  dao: ethers.Contract,
  veGovLockup: ethers.Contract,
};

export type FluidityBeaconAddresses = {
  token: string,
  compoundLiquidityProvider: string,
  aaveV2LiquidityProvider: string,
  aaveV3LiquidityProvider: string,
  registry: string,
  operator: string
};

export type FluidityFactories = {
  upgradeableBeacon: ethers.ContractFactory,
  govToken: ethers.ContractFactory,
  veGovLockup: ethers.ContractFactory,
  registry: ethers.ContractFactory,
  operator: ethers.ContractFactory,
  token: ethers.ContractFactory,
  compoundLiquidityProvider: ethers.ContractFactory,
  aaveV2LiquidityProvider: ethers.ContractFactory,
  aaveV3LiquidityProvider: ethers.ContractFactory,
  dao: ethers.ContractFactory,
  staking: ethers.ContractFactory
  utilityGauges: ethers.ContractFactory
};

export type FluiditySigners = {
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
    extraSigner1: ethers.Signer,
    extraSigner2: ethers.Signer
  },

  veGovLockup: {
    owner: ethers.Signer
  }
};

export type FluidityBindings = {
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

  veGovLockup: {
    spender: ethers.Contract
  }
};

export type TokenAddresses = {
  [symbol: string]: {
    deployedToken: ethers.Contract,
    deployedPool: ethers.Contract
  }
};

export type FluidityClientChange = {
  name: string,
  overwrite: boolean,
  token: string,
  client: string,
};
