
import { ethers } from 'ethers';
import type { HardhatRuntimeEnvironment } from 'hardhat/types';

import type { FluidityContracts, Token, TokenAddresses } from './types';

export const deployTestUtility = async (
  hre: HardhatRuntimeEnvironment,
  boundOperatorOperator: ethers.Contract,
  token: string,
) => {
  const factory = await hre.ethers.getContractFactory("TestClient");
  const client = await factory.deploy(boundOperatorOperator.address);

  await client.deployed();

  await boundOperatorOperator.updateUtilityClients([{
    name: "test",
    overwrite: false,
    token,
    client,
  }]);

  return client;
};

export const deployBeacons = async(
  hre: HardhatRuntimeEnvironment,
  ...factories: ethers.ContractFactory[]
): Promise<ethers.Contract[]> =>
  Promise.all(factories.map((v) => hre.upgrades.deployBeacon(v)));

// deployTokens, registering the utility clients against the registry
// (not listing the tokens here though)
export const deployTokens = async (
  hre: HardhatRuntimeEnvironment,
  tokens: Token[],
  aaveV2PoolProvider: string,
  aaveV3PoolProvider: string,
  councilAddress: string,
  externalOperatorAddress: string,
  boundOperatorOperator: ethers.Contract,
  boundRegistryOperator: ethers.Contract,
  externalOracleAddress: string,

  tokenFactory: ethers.ContractFactory,
  tokenBeacon: string,

  compoundFactory: ethers.ContractFactory,
  compoundBeacon: string,

  aaveV2Factory: ethers.ContractFactory,
  aaveV2Beacon: string,

  aaveV3Factory: ethers.ContractFactory,
  aaveV3Beacon: string
): Promise<{
  tokens: TokenAddresses,
}> => {
  const tokenAddresses: TokenAddresses = {};

  for (const token of tokens) {
    console.log(`deploying ${token.name}`);

    let deployedPool: ethers.Contract;

    const deployedToken = await hre.upgrades.deployBeaconProxy(
      tokenBeacon,
      tokenFactory,
    );

    switch (token.backend) {
      case 'compound':
        deployedPool = await hre.upgrades.deployBeaconProxy(
          compoundBeacon,
          compoundFactory,
          [token.compoundAddress, deployedToken.address],
          {initializer: "init(address, address)"},
        );

        break;

      case 'aaveV2':
        deployedPool = await hre.upgrades.deployBeaconProxy(
          aaveV2Beacon,
          aaveV2Factory,
          [aaveV2PoolProvider, token.aaveAddress, deployedToken.address],
          {initializer: "init(address, address, address)"},
        );

        break;

      case 'aaveV3':
        deployedPool = await hre.upgrades.deployBeaconProxy(
          aaveV3Beacon,
          aaveV3Factory,
          [aaveV3PoolProvider, token.aaveAddress, deployedToken.address],
          {initializer: "init(address, address, address)"},
        );

        break;

      default:
        throw new Error("token backend ${token.backend} unusual!");
    }

    await deployedPool.deployed();

    await deployedToken.deployed();

    await deployedToken.functions.init(
      deployedPool.address,
      token.decimals,
      token.name,
      token.symbol,
      councilAddress,
      externalOperatorAddress,
      boundOperatorOperator.address,
    );

    await boundRegistryOperator.updateUtilityClients([{
      name: "FLUID",
      overwrite: false,
      token: deployedToken.address,
      client: deployedToken.address,
    }]);

    await boundOperatorOperator.updateOracles([{
      contractAddr: deployedToken.address,
      newOracle: externalOracleAddress,
    }]);

    tokenAddresses[token.symbol] = {deployedToken, deployedPool};

    console.log(`deployed ${token.name} to ${deployedToken.address}`);
  }

  return {
    tokens: tokenAddresses
  };
};

export const deployRegistry = async(
  hre: HardhatRuntimeEnvironment,
  factory: ethers.ContractFactory,
  beaconAddress: string,
  operatorAddress: string
): Promise<ethers.Contract> => {
  const beaconProxy = await hre.upgrades.deployBeaconProxy(
    beaconAddress,
    factory,
    [operatorAddress],
    {
      initializer: "init(address)"
    }
  );

  return beaconProxy;
};

export const deployOperator = async(
  hre: HardhatRuntimeEnvironment,
  factory: ethers.ContractFactory,
  beaconAddress: string,
  operatorAddress: string,
  emergencyCouncilAddress: string,
  registryAddress: string
): Promise<ethers.Contract> => {
  const beaconProxy = await hre.upgrades.deployBeaconProxy(
    beaconAddress,
    factory,
    [operatorAddress, emergencyCouncilAddress, registryAddress],
    {
      initializer: "init(address,address,address)"
    }
  );

  return beaconProxy;
};

export const deployGovToken = async(
  factory: ethers.ContractFactory,
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: number
): Promise<ethers.Contract> => factory.deploy(
  name,
  symbol,
  decimals,
  totalSupply
);

export const deployVeGovLockup = async (
  factory: ethers.ContractFactory,
  emergencyCouncil: string,
  voteTokenAddress: string
): Promise<ethers.Contract> => factory.deploy(
  emergencyCouncil,
  voteTokenAddress
);

export const deployDAOV1 = async(
  factory: ethers.ContractFactory,
  emergencyCouncil: string,
  veGovLockupAddress: string
): Promise<ethers.Contract> => factory.deploy(
  emergencyCouncil,
  veGovLockupAddress
);

// deployFluidity by deploying contracts that aren't tokens
export const deployFluidity = async (
  hre: HardhatRuntimeEnvironment,
  emergencyCouncilAddress: string,

  govTokenName: string,
  govTokenSymbol: string,
  govTokenDecimals: number,
  govTokenTotalSupply: number,

  registryFactory: ethers.ContractFactory,
  operatorFactory: ethers.ContractFactory,
  govTokenFactory: ethers.ContractFactory,
  veGovLockupFactory: ethers.ContractFactory,
  daoFactory: ethers.ContractFactory,

  registryBeaconAddress: string,
  operatorBeaconAddress: string
): Promise<FluidityContracts> => {
  const rootSigner = (await hre.ethers.getSigners())[0];

  const rootSignerAddress = await rootSigner.getAddress();

  const registry = await deployRegistry(
    hre,
    registryFactory,
    registryBeaconAddress,
    rootSignerAddress
  );

  const operator = await deployOperator(
    hre,
    operatorFactory,
    operatorBeaconAddress,
    rootSignerAddress,
    emergencyCouncilAddress,
    registry.address
  );

  const govToken = await deployGovToken(
    govTokenFactory,
    govTokenName,
    govTokenSymbol,
    govTokenDecimals,
    govTokenTotalSupply
  );

  const veGovLockup = await deployVeGovLockup(
    veGovLockupFactory,
    emergencyCouncilAddress,
    govToken.address
  );

  const dao = await deployDAOV1(
    daoFactory,
    emergencyCouncilAddress,
    veGovLockup.address
  );

  await veGovLockup.updateOperator(dao.address);

  await registry.updateOperator(dao.address);

  await operator.updateOperator(dao.address);

  return {
    operator: operator,
    govToken: govToken,
    registry: registry,
    dao: dao,
    veGovLockup: veGovLockup
  }
};
