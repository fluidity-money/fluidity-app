
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

export const deployWorkerConfig = async (
  hre: HardhatRuntimeEnvironment,
  operator: string,
  emergencyCouncil: string,
): Promise<string> => {
  const factory = await hre.ethers.getContractFactory("WorkerConfig");

  const workerConfig = await factory.deploy();

  await workerConfig.deployed();

  await workerConfig.init(operator, emergencyCouncil);

  return workerConfig.address;
}

export type TokenAddresses = {
  [symbol: string]: {
    deployedToken: ethers.Contract,
    deployedPool: ethers.Contract
  }
};

export const deployTokens = async (
  hre: HardhatRuntimeEnvironment,
  tokens: Token[],
  aaveV2PoolProvider: string,
  aaveV3PoolProvider: string,
  emergencyCouncilAddress: string,
  operatorAddress: string,
  workerConfigAddress: string
): Promise<{
  tokenBeacon: ethers.Contract,
  aaveV2Beacon: ethers.Contract,
  compoundBeacon: ethers.Contract,
  tokens: TokenAddresses,
}> => {
  const tokenFactory = await hre.ethers.getContractFactory("Token");
  const compoundFactory = await hre.ethers.getContractFactory("CompoundLiquidityProvider");
  const aaveV2Factory = await hre.ethers.getContractFactory("AaveV2LiquidityProvider");
  const aaveV3Factory = await hre.ethers.getContractFactory("AaveV3LiquidityProvider");

  const tokenBeacon = await hre.upgrades.deployBeacon(tokenFactory);
  const compoundBeacon = await hre.upgrades.deployBeacon(compoundFactory);
  const aaveV2Beacon = await hre.upgrades.deployBeacon(aaveV2Factory);
  const aaveV3Beacon = await hre.upgrades.deployBeacon(aaveV3Factory);

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
      emergencyCouncilAddress,
      operatorAddress,
      workerConfigAddress,
    );

    tokenAddresses[token.symbol] = {deployedToken, deployedPool};

    console.log(`deployed ${token.name} to ${deployedToken.address}`);
  }

  return {
    tokenBeacon,
    aaveV2Beacon,
    compoundBeacon,
    tokens: tokenAddresses,
  };
};

export const forknetTakeFunds = async (
  hre: HardhatRuntimeEnvironment,
  accounts: ethers.Signer[],
  tokens: {name: string, owner: string, address: string}[],
) => {
  for (const token of tokens) {

    console.log(`taking ${token.name}`);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [token.owner],
    });

    const impersonatedToken = await hre.ethers.getContractAt(
      "IERC20",
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
      await impersonatedToken.transfer(await address.getAddress(), amount);

      if (!(await impersonatedToken.balanceOf(await address.getAddress())).eq(amount))
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

// statically ensure an object can't exist (ie, all enum varients are handled)
function assertNever(_: never): never { throw new Error(`assertNever called: ${arguments}`); }
