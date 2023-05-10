
import hre from 'hardhat';

import { mustEnv } from '../script-utils';

import { deployTransparentUpgradeableProxy } from "../deployment";

const ENV_PROXY_ADMIN = `FLU_ETHEREUM_PROXY_ADMIN`;

export const mainDeployTransparentUpgradeableProxy = async (
  factoryName: string,
  envNames: string[]
) => {
  const rootSigner = (await hre.ethers.getSigners())[0];

  const rootSignerAddress = await rootSigner.getAddress();

  const proxyAdmin = mustEnv(ENV_PROXY_ADMIN);

  const envs = envNames.map((envName: string) => mustEnv(envName));

  const factory = await hre.ethers.getContractFactory(factoryName);

  console.log(
    `Deploying ${factoryName} transparent proxy with proxy admin ${proxyAdmin} with the signer ${rootSignerAddress}`
  );

  const impl = await factory.deploy();

  console.log(`Deployed the ${factoryName} implementation to ${impl.address}`);

  const initEncoded = factory.interface.encodeFunctionData("init", envs);

  const proxy = await deployTransparentUpgradeableProxy(
    hre,
    impl.address,
    proxyAdmin,
    initEncoded
  );

  console.log(
    `Deployed ${factoryName} transparent proxy to ${proxy.address} with implementation address ${impl.address}, proxy admin ${proxyAdmin} and the init calldata ${initEncoded}`
  );
};
