import hre from 'hardhat'
import { mustEnv } from '../script-utils';

const ENV_TOKEN_BEACON_ADDRESS = `FLU_ETHEREUM_TOKEN_BEACON_ADDRESS`;

const main = async () => {
    const backendAddress = mustEnv(ENV_TOKEN_BEACON_ADDRESS);

    const tokenFactory = await hre.ethers.getContractFactory("Token");

    const impersonatedAddress = "0xe0ead43d9266154f777Cb831476be99f6c40B96d";
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [impersonatedAddress],
    });

    const signer = await hre.ethers.getSigner(impersonatedAddress);

    const tokenBeacon = await hre.ethers.getContractAt(
        [
            "function upgradeTo(address newImplementation) external",
            "function implementation() view returns (address)"
        ],
        backendAddress,
        signer,
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

    const transaction = await tokenBeacon.upgradeTo(
        deployedUnderlyingAddress
    );

    console.log(`data to upgrade the beacon is: ${transaction}`);
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);
