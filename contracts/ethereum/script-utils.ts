
import { promisify } from 'util';
import { readFile as readFileCb } from 'fs';
import { ethers, BigNumber } from 'ethers';
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

const deploy = async (
  hre: HardhatRuntimeEnvironment,
  contract: string,
) => {
  const factory = await hre.ethers.getContractFactory(contract);
  if (!factory) throw new Error(`Contract '${contract}' not found!`);
  const c = await factory.deploy();
  await c.deployed();
  return c;
}

const deployAndInit = async (
  hre: HardhatRuntimeEnvironment,
  contract: string,
  ...args: any[]
) => {
  let c = await deploy(hre, contract);
  await c.init(...args);
  return c;
}

export const deployOperator = async (
  hre: HardhatRuntimeEnvironment,
  externalOperator: ethers.Signer,
  council: ethers.Signer,
): Promise<ethers.Contract> => {
  return deployAndInit(
    hre,
    "Operator",
    await externalOperator.getAddress(),
    await council.getAddress(),
  )
};

export const deployGovToken = async (
  hre: HardhatRuntimeEnvironment,
  govOperatorSigner: ethers.Signer
): Promise<ethers.Contract> => {
  const factory = (await hre.ethers.getContractFactory("GovToken"))
    .connect(govOperatorSigner);

  const govToken = await factory.deploy();
  await govToken.deployed();

  await govToken.init(
    "Fluidity Money",
    "FLUID",
    18,
    BigNumber.from("1000000000000000000000000000")
  );
  return govToken;
};

export const deployTestUtility = async (
  hre: HardhatRuntimeEnvironment,
  operator: ethers.Contract,
  externalOperator: string,
  token: string,
) => {
  const factory = await hre.ethers.getContractFactory("TestClient");
  const client = await factory.deploy(operator.address);
  await client.deployed();

  await addUtilityClient(
    hre,
    operator.address,
    externalOperator,
    [{
      name: "test",
      overwrite: false,
      token,
    }],
  );
  return client;
};

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
  council: ethers.Signer,
  operator: ethers.Contract,
  externalOperator: ethers.Signer,
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
      councilAddress,
      externalOperator,
      operator,
    );

    await addUtilityClient(
      hre,
      operator,
      externalOperator,
      [{
        name: "FLUID",
        overwrite: false,
        token: deployedToken.address,
        client: deployedToken.address,
      }],
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

export const deployRewardPools = async (
  hre: HardhatRuntimeEnvironment,
  externalOperator: ethers.Signer,
  tokens: ethers.Contract[]
): Promise<ethers.Contract> => {
  return deployAndInit(
    hre,
    "RewardPools",
    await externalOperator.getAddress(),
    tokens.map(e => e.address),
  );
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

export const addUtilityClient = async(
  hre: HardhatRuntimeEnvironment,
  operator: string,
  externalOperator: string,
  changes: FluidityClientChange[]
) => {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [externalOperator],
  });

  let impersonatedOperator = await hre.ethers.getContractAt(
    "Operator",
    operator,
    await hre.ethers.getSigner(externalOperator),
  );

  console.log(`op: ${await impersonatedOperator.operator_()}`);
  console.log(`calling from: ${await impersonatedOperator.signer.getAddress()}`);

  console.log(`setting util client ${JSON.stringify(changes)}`);
  await impersonatedOperator.updateUtilityClients(changes);
  console.log("done");

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [externalOperator],
  });
}
// statically ensure an object can't exist (ie, all enum varients are handled)
function assertNever(_: never): never { throw new Error(`assertNever called: ${arguments}`); }
