import hre from 'hardhat';
const ethers = hre.ethers;
import "@nomiclabs/hardhat-waffle";
import { USUAL_FUSDT_ADDR } from '../test-constants';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// take 20 accounts and randomly transfer some amount of usdc to every other one of those accounts
async function main() {
  const promises: Promise<void>[] = [];
  // cap this at 20 accounts (400 txns)
  (await ethers.getSigners()).slice(0, 20)
    .forEach(signer => promises.push(makeTxns(signer)))
  return Promise.allSettled(promises);
}

async function makeTxns(testAccount: SignerWithAddress) {
  const token = (await ethers.getContractFactory("TokenCompound"))
    .attach(USUAL_FUSDT_ADDR)
    .connect(testAccount);

  for (const signer of (await ethers.getSigners()).slice(0, 20)) {
    if (signer.address !== testAccount.address) {
      const amount = Math.floor(Math.random() * (await token.balanceOf(testAccount.address)))
      if (amount > 0) {
        const res = await token.transfer(signer.address, amount);
        await res.wait();
        console.log("made transfer", amount);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
