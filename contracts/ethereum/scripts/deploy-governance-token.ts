import hre from "hardhat";
import { mustEnv } from "../script-utils";
import type { ethers } from "ethers";
import { BigNumber} from "ethers";

const ENV_OPERATOR = `FLU_ETHEREUM_OPERATOR_ADDRESS`;

const name = "Fluidity Money";
const symbol = "FLUID";
const decimals = 18;
const totalSupply = BigNumber.from("1000000000000000000000000000"); // 1_000_000_000 FLUID tokens

const main = async () => {
    const factory = await hre.ethers.getContractFactory("GovToken");
    const proxy = await hre.upgrades.deployProxy(factory);

    const proxyDeployHash = proxy.deployTransaction.hash;

    console.log(
        `deploying proxy for GovToken to ${proxy.address} with transaction ${proxyDeployHash}...`
    );

    await proxy.deployed();

    console.log(
        `deployed proxy for GovToken to ${proxy.address} with transaction ${proxyDeployHash}`
    );

    const initTransaction = await proxy.init(
        name,
        symbol,
        decimals,
        totalSupply
    );

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

