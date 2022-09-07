import hre from 'hardhat'
import { mustEnv } from '../script-utils';
import type { ethers } from 'ethers';

const tasks: {[k: string]: {contract: string, name: string}} = {
    token: {contract: "Token", name: "token"},
    aave: {contract: "AaveLiquidityProvider", name: "aave liquidity pool"},
    compound: {contract: "CompoundLiquidityProvider", name: "compound liquidity pool"},
    workerconfig: {contract: "WorkerConfig", name: "worker config storage"},
};

const main = async () => {
    var targets = process.env['FLU_ETHEREUM_DEPLOY_TARGETS']?.split(',');
    if (!targets) targets = Object.keys(tasks);

    for (const target of targets) {
        const task = tasks[target];
        if (!task) {
            const validTasks = Object.keys(tasks).join(',');
            throw new Error(`Invalid target ${target} - valid tasks ${validTasks}`);
        }
        const { contract, name } = task;

        console.log(`deploying beacon for ${name}...`);

        const factory = await hre.ethers.getContractFactory(contract);
        const beacon = await hre.upgrades.deployBeacon(factory);
        console.log(`deployed beacon proxy for ${name} to ${beacon.address}`);
    }
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);
