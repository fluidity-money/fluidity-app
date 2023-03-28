
import hre from 'hardhat';

import { mustEnv } from '../script-utils';
import type { ethers } from 'ethers';

import { deployRegistry } from "../deployment";

const ENV_OPERATOR = `FLU_ETHEREUM_OPERATOR_ADDRESS`;

const ENV_BEACON = `FLU_ETHEREUM_BEACON_REGISTRY`;

const main = async () => {
  const rootSigner = (await hre.ethers.getSigners())[0];

  const rootSignerAddress = await rootSigner.getAddress();

  const operatorAddress = mustEnv(ENV_OPERATOR);
  const beaconAddress = mustEnv(ENV_BEACON);

  const factory = await hre.ethers.getContractFactory("Registry");

  console.log(
    `Deploying registry beacon proxy for ${beaconAddress}, operator ${operatorAddress}, with the signer ${rootSignerAddress}`
  );

  const registry = await deployRegistry(
    hre,
    rootSigner,
    factory,
    beaconAddress,
    operatorAddress
  );

  console.log(
    `Deployed registry beacon proxy for ${beaconAddress} to ${registry.address}`
  );
};

main().then(() => console.log("done"));
