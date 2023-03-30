
import hre from 'hardhat';

import { mustEnv } from '../script-utils';

import { deployOperator } from "../deployment";

const ENV_OPERATOR = `FLU_ETHEREUM_OPERATOR_ADDRESS`;

const ENV_EMERGENCY_COUNCIL = `FLU_ETHEREUM_EMERGENCY_COUNCIL_ADDRESS`;

const ENV_REGISTRY = `FLU_ETHEREUM_REGISTRY_ADDRESS`;

const ENV_BEACON = `FLU_ETHEREUM_BEACON_EXECUTOR`;

const main = async () => {
  const rootSigner = (await hre.ethers.getSigners())[0];

  const rootSignerAddress = await rootSigner.getAddress();

  const operatorAddress = mustEnv(ENV_OPERATOR);
  const emergencyCouncilAddress = mustEnv(ENV_EMERGENCY_COUNCIL);
  const registryAddress = mustEnv(ENV_REGISTRY);

  const beaconAddress = mustEnv(ENV_BEACON);

  const factory = await hre.ethers.getContractFactory("Executor");

  console.log(
    `Deploying executor beacon proxy for ${beaconAddress}, operator ${operatorAddress}, emergency council ${emergencyCouncilAddress}, registry ${registryAddress} with the signer ${rootSignerAddress}`
  );

  const executor = await deployOperator(
    hre,
    rootSigner,
    factory,
    beaconAddress,
    operatorAddress,
    emergencyCouncilAddress,
    registryAddress
  );

  console.log(
    `Deployed executor beacon proxy for ${beaconAddress} to ${executor.address}`
  );
};

main().then(() => console.log("done"));
