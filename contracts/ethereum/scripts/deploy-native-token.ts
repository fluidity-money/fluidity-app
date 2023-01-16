import hre from "hardhat";
import { mustEnv } from "../script-utils";
import type { ethers } from "ethers";

const ENV_OPERATOR = `FLU_ETHEREUM_OPERATOR_ADDRESS`;

const name = "Fluidity Money";
const symbol = "FLUID";
const decimals = 18;

const main = async () => {
    const operator = mustEnv(ENV_OPERATOR);

    const factory = await hre.ethers.getContractFactory("FluidToken");
    const proxy = await hre.upgrades.deployProxy(factory);

    await proxy.deployed();

	console.log(
		`deployed proxy for RewardPools to ${proxy.address} with transaction ${proxyDeployHash}`
	);

	const initTransaction = await proxy.init(operator, targets);
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);

