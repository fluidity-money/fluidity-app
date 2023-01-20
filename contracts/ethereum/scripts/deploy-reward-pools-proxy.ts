import hre from 'hardhat'
import { mustEnv } from '../script-utils';
import type { ethers } from 'ethers';

const ENV_TOKENS = `FLU_ETHEREUM_TOKEN_ADDRESSES`;

const ENV_OPERATOR = `FLU_ETHEREUM_OPERATOR_ADDRESS`;

const main = async () => {
  const targets = mustEnv(ENV_TOKENS).split(",");
  const operator = mustEnv(ENV_OPERATOR);

  console.log(`deploying RewardPools.sol with operator ${operator} and targets ${targets}`);

  const rewardPools = await hre.ethers.getContractFactory("RewardPools");
  const proxy = await hre.upgrades.deployProxy(rewardPools);

  await proxy.deployed();

  const proxyDeployHash = proxy.deployTransaction.hash;

  console.log(
    `deployed proxy for RewardPools to ${proxy.address} with transaction ${proxyDeployHash}`
  );

  const initTransaction = await proxy.init(operator, targets);

  const initTransactionHash = initTransaction.hash;

  console.log(
    `initialised the transaction with hash ${initTransactionHash}`
  );
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);

