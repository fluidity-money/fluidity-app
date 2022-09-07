import hre from 'hardhat'
import { mustEnv } from '../script-utils';
import type { ethers } from 'ethers';
import { upgrades } from 'hardhat';

const ENV_UPGRADEABLE_PROXY_ADDRESS = `FLU_ETHEREUM_UPGRADEABLE_PROXY_ADDRESS`;

const ENV_OPERATOR = `FLU_ETHEREUM_OPERATOR_ADDRESS`;

const main = async () => {
    const upgradeableProxyAddress = mustEnv(ENV_UPGRADEABLE_PROXY_ADDRESS);
    const operatorAddress = mustEnv(ENV_OPERATOR);

    const signers = await hre.ethers.getSigners();

    const signer = signers[0];

    const upgradeableProxy = await hre.ethers.getContractAt(
        [
            "function owner() view returns (address)",
            "function transferOwnership(address)"
        ],
        upgradeableProxyAddress,
        signer
    );

    const currentAdminAddress = await upgradeableProxy.owner();

    console.log(
        `For address ${upgradeableProxyAddress}, current owner is ${currentAdminAddress}`
    );

    const changeAdminTransaction =
        await upgradeableProxy.transferOwnership(operatorAddress);

    const changeAdminTransactionAddress = changeAdminTransaction.hash;

    console.log(
        `Change admin address transaction is ${changeAdminTransactionAddress}`
    );

    const newAdminAddress  = await upgradeableProxy.owner();

    console.log(
        `For address ${upgradeableProxyAddress}, new owner is ${newAdminAddress}`
    );
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);
