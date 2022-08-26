
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
      compoundAddress: string
    } | {
      backend: 'aave',
      aaveAddress: string
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

export const deployTokens = async (
    hre: HardhatRuntimeEnvironment,
    tokens: Token[],
    aavePoolProvider: string,
    oracleAddress: string,
    emergencyCouncilAddress: string,
    operatorAddress: string
): Promise<{
    tokenBeacon: ethers.Contract,
    aaveBeacon: ethers.Contract,
    compoundBeacon: ethers.Contract,
    tokens: {[symbol: string]: [ethers.Contract, ethers.Contract]},
}> => {
  const tokenFactory = await hre.ethers.getContractFactory("Token");
  const compoundFactory = await hre.ethers.getContractFactory("CompoundLiquidityProvider");
  const aaveFactory = await hre.ethers.getContractFactory("AaveLiquidityProvider");

  const tokenBeacon = await hre.upgrades.deployBeacon(tokenFactory);
  const compoundBeacon = await hre.upgrades.deployBeacon(compoundFactory);
  const aaveBeacon = await hre.upgrades.deployBeacon(aaveFactory);

  const tokenAddresses: {[symbol: string]: [ethers.Contract, ethers.Contract]} = {};

  for (const token of tokens) {
      console.log(`deploying ${token.name}`);

      var deployedPool: ethers.Contract;

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
          );

          break;

          case 'aave':
              deployedPool = await hre.upgrades.deployBeaconProxy(
                  aaveBeacon,
                  aaveFactory,
                  [aavePoolProvider, token.aaveAddress, deployedToken.address],
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
          oracleAddress,
          emergencyCouncilAddress,
          operatorAddress,
          1000, // Reward quarantine
          false, // Limited supply
          1000000, // Global limit
          10000, // User limit
      );

      tokenAddresses[token.symbol] = [deployedToken, deployedPool];

      console.log(`deployed ${token.name} to ${deployedToken.address}`);
  }

  return {
    tokenBeacon: tokenBeacon,
    aaveBeacon: aaveBeacon,
    compoundBeacon: compoundBeacon,
    tokens: tokenAddresses,
  };
};

export const forknetTakeFunds = async (
  hre: HardhatRuntimeEnvironment,
  accounts: ethers.Signer[],
  tokens: Token[],
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
