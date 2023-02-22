
import { promisify } from 'util';
import { readFile as readFileCb } from 'fs';
import { ethers } from 'ethers';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';

export const readFile = promisify(readFileCb);

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

export const mustEnv = (env: string): string => {
  const e = process.env[env];
  if (e === undefined) {
    throw new Error(`Env ${env} not set!`);
  }
  return e;
};

export const optionalEnv = (env: string, fallback: string): string => {
  let e = process.env[env];
  if (e === undefined) {
    console.log(`Optional env ${env} not set - defaulting to '${fallback}`);
    e = fallback;
  }
  return e;
};

export const getFactories = async(
  hre: HardhatRuntimeEnvironment
): Promise<[
  ethers.ContractFactory,
  ethers.ContractFactory,
  ethers.ContractFactory,
  ethers.ContractFactory
]> =>
  Promise.all([
    hre.ethers.getContractFactory("Token"),
    hre.ethers.getContractFactory("CompoundLiquidityProvider"),
    hre.ethers.getContractFactory("AaveV2LiquidityProvider"),
    hre.ethers.getContractFactory("AaveV3LiquidityProvider")
  ]);

export const deployBeacons = async (
  hre: HardhatRuntimeEnvironment,
  tokenFactory: ethers.ContractFactory,
  compoundFactory: ethers.ContractFactory,
  aaveV2Factory: ethers.ContractFactory,
  aaveV3Factory: ethers.ContractFactory
): Promise<[ethers.Contract, ethers.Contract, ethers.Contract, ethers.Contract]> =>
  Promise.all([
    hre.upgrades.deployBeacon(tokenFactory),
    hre.upgrades.deployBeacon(compoundFactory),
    hre.upgrades.deployBeacon(aaveV2Factory),
    hre.upgrades.deployBeacon(aaveV3Factory)
  ]);

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

export type TokenAddresses = {
  [symbol: string]: {
    deployedToken: ethers.Contract,
    deployedPool: ethers.Contract
  }
};

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
  tokenBeacon: ethers.Contract,

  compoundFactory: ethers.ContractFactory,
  compoundBeacon: ethers.Contract,

  aaveV2Factory: ethers.ContractFactory,
  aaveV2Beacon: ethers.Contract,

  aaveV3Factory: ethers.ContractFactory,
  aaveV3Beacon: ethers.Contract
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
        assertNever(token);

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

export const forknetTakeFunds = async (
  hre: HardhatRuntimeEnvironment,
  accounts: string[],
  tokens: {name: string, owner: string, address: string}[],
) => {
  for (const token of tokens) {

    console.log(`taking ${token.name}`);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [token.owner],
    });

    const impersonatedToken = await hre.ethers.getContractAt(
      "Token",
      token.address,
      await hre.ethers.getSigner(token.owner),
    );

    const initialUsdtBalance: ethers.BigNumber =
      await impersonatedToken.balanceOf(token.owner);

    const initialUsdtBalanceString = initialUsdtBalance.toString();

    console.log(
      `token holder for ${token.name} has balance ${initialUsdtBalanceString}`);

    const amount = initialUsdtBalance.div(accounts.length);

    const promises = accounts.map(async address => {
      await impersonatedToken.transfer(address, amount);

      if (!(await impersonatedToken.balanceOf(address)).eq(amount))
        throw new Error(`failed to take token ${token.name} ${token.address}`);
    });

    await Promise.all(promises);

    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [token.owner],
    });

    console.log(`finished taking ${token.name}`);
  }
};

export const setOracles = async (
  hre: HardhatRuntimeEnvironment,
  tokenAddresses: string[],
  externalOperator: string,
  oracle: string,
  operator: ethers.Contract,
) => {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [externalOperator],
  });

  let impersonatedOperator = operator.connect(await hre.ethers.getSigner(externalOperator));

  let oracles = tokenAddresses.map(token => {
    return {contractAddr: token, newOracle: oracle};
  });

  await impersonatedOperator.updateOracles(oracles);

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [externalOperator],
  });
}

export type FluidityClientChange = {
  name: string,
  overwrite: boolean,
  token: string,
  client: string,
};

// statically ensure an object can't exist (ie, all enum varients are handled)
function assertNever(_: never): never { throw new Error(`assertNever called: ${arguments}`); }
