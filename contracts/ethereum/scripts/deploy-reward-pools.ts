import hre from 'hardhat'
import { mustEnv } from '../script-utils';
import type { ethers } from 'ethers';

const main = async () => {
  const factory = await hre.ethers.getContractFactory("RewardPools");

  const rewardPools = await factory.deploy();

  await rewardPools.deployed();

  const rewardPoolsDeployHash = rewardPools.deployTransaction.hash;

  console.log(
    `deployed RewardPools to ${rewardPools.address} with transaction ${rewardPoolsDeployHash}`
  );
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);
