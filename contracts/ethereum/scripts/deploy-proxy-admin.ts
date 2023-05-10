
import hre from 'hardhat';

import { mustEnv } from '../script-utils';

import { deployProxyAdmin } from "../deployment";

const ENV_ADMIN_OWNER = `FLU_ETHEREUM_PROXY_ADMIN_OWNER`;

export const main = async () => {
  const rootSigner = (await hre.ethers.getSigners())[0];

  const rootSignerAddress = await rootSigner.getAddress();

  const ownerAddress = mustEnv(ENV_ADMIN_OWNER);

  console.log(
    `Deploying proxy admin for owner ${ownerAddress} with the signer ${rootSignerAddress}...`
  );

  const proxyAdmin = await deployProxyAdmin(hre, rootSigner);

  console.log(`Deployed the proxy admin to ${proxyAdmin.address}, setting the correct admin now...`);

  const transferTx = await proxyAdmin.transferOwnership(ownerAddress);

  console.log(
    `Transferred the ownership of ${proxyAdmin.address} to ${ownerAddress} with transaction ${transferTx.hash}, proxy admin was deployed to ${proxyAdmin.address}`
  );
};

main().then(_ => {});
