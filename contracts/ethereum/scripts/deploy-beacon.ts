
import hre from 'hardhat'

const tasks: {[k: string]: {contract: string, name: string}} = {
    token: {contract: "Token", name: "token"},
    aaveV2: {contract: "AaveV2LiquidityProvider", name: "aave v2 liquidity pool"},
    aaveV3: {contract: "AaveV3LiquidityProvider", name: "aave v3 liquidity pool"},
    stupid: {contract: "StupidLiquidityProvider",name:  "stupid liquidity pool"},
    compound: {contract: "CompoundLiquidityProvider", name: "compound liquidity pool"},
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
        console.log(`deployed beacon for ${name} to ${beacon.address}`);
    }
};

main().then(() => console.log("done"));
