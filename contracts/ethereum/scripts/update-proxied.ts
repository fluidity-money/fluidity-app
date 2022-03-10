// @ts-ignore
import { ethers, upgrades } from 'hardhat'
import { CUSDT_ADDR, USUAL_FUSDT_ADDR } from '../test-constants'

async function main() {
    const TokenV2 = await ethers.getContractFactory("TokenCompound");
    const t2 = await upgrades.upgradeProxy(process.env.FLU_TOKEN_UPGRADE_ADDRESS!, TokenV2);
    console.log(`Upgraded token!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
