import hre from 'hardhat'
import { mustEnv } from '../script-utils';
import type { ethers } from 'ethers';

const ENV_BEACON_CONFIG = `FLU_ETHEREUM_BEACON_WORKER_CONFIG`;

const ENV_OPERATOR = `FLU_ETHEREUM_OPERATOR_ADDRESS`;
const ENV_COUNCIL = `FLU_ETHEREUM_EMERGENCY_COUNCIL_ADDRESS`;

const main = async () => {
  const configBeacon = mustEnv(ENV_BEACON_CONFIG);
  const configFactory = await hre.ethers.getContractFactory("WorkerConfig");

  const operator = mustEnv(ENV_OPERATOR);
  const council = mustEnv(ENV_COUNCIL);

  console.log(`deploying config w impl ${configBeacon} operator ${operator} council ${council}`);
  const config = await hre.upgrades.deployBeaconProxy(
    configBeacon,
    configFactory,
    [operator, council],
    {initializer: "init(address, address)"},
  );

  await config.deployed();
  console.log(`worker config deployed to address ${config.address}`);
};

(async () => {
  await main();
})();
