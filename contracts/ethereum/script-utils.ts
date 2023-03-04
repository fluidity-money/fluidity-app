
import { promisify } from 'util';
import { readFile as readFileCb } from 'fs';
import { ethers } from 'ethers';
import type { HardhatRuntimeEnvironment } from 'hardhat/types';

export const readFile = promisify(readFileCb);

export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

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

export const forknetTakeFunds = async (
  hre: HardhatRuntimeEnvironment,
  accounts: string[],
  tokens: {name: string, owner: string, address: string}[],
) => {
  for (const token of tokens) {
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
};

