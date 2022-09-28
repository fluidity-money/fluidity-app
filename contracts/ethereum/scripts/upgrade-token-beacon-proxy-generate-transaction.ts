import hre from 'hardhat'
import { mustEnv } from '../script-utils';

const ENV_TOKEN_BEACON_PROXY_ADDRESS = `FLU_ETHEREUM_TOKEN_BEACON_PROXY_ADDRESS`;

const main = async () => {
    const backendAddress = mustEnv(ENV_TOKEN_BEACON_PROXY_ADDRESS);

    const tokenFactory = await hre.ethers.getContractFactory("Token");

    const tokenBeacon = await hre.ethers.getContractAt(
        [
            "function upgradeTo(address newImplementation) external",
            "function implementation() view returns (address)"
        ],
        backendAddress
    );

    let tokenImplementation = await tokenBeacon.implementation();

    console.log(`beacon at ${backendAddress} implementation address was ${tokenImplementation}`);

    const deployedUnderlying = await tokenFactory.deploy();

    const deployedUnderlyingAddress = deployedUnderlying.address;

    const deployedUnderlyingTransactionHash = deployedUnderlying.deployTransaction.hash;

    console.log(
        `deployed underlying transaction hash with hash ${deployedUnderlyingTransactionHash}`,
        deployedUnderlyingTransactionHash
    );

    console.log(`deployed the underlying contract to ${deployedUnderlyingAddress}`);

    const transaction = await tokenBeacon.populateTransaction.upgradeTo(
        deployedUnderlyingAddress
    );

    console.log(`data to upgrade the beacon proxy is: ${transaction.data}`);
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);
