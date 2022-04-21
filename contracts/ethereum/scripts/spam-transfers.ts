import hre from 'hardhat';
import { USUAL_FUSDT_ADDR } from '../test-constants';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { optionalEnv } from '../script-utils';

const EnvContractAddress = `FLU_ETHEREUM_SPAM_TRANSFERS_CONTRACT_ADDRESS`;

const targetAddress = optionalEnv(EnvContractAddress, USUAL_FUSDT_ADDR);

// take 20 accounts and randomly transfer some amount of usdc to every other one of those accounts
async function main() {
  const signers = (await hre.ethers.getSigners()).slice(0, 20);

  const promises: Promise<void>[] = [];
  // cap this at 20 accounts (400 txns)
  for (const signer of signers) {
    promises.push(makeTxns(signer, signers));
  }

  return Promise.allSettled(promises);
}

async function makeTxns(from: SignerWithAddress, to: SignerWithAddress[]) {
  const token = await hre.ethers.getContractAt(
    targetAddress,
    "IERC20",
    from,
  );

  for (const signer of to) {
    if (signer.address !== from.address) {
      const balance = await token.balanceOf(from.address);
      const amount = Math.floor(Math.random() * balance)
      if (amount > 0) {
        const res = await token.transfer(signer.address, amount);
        await res.wait();
        console.log(`sent ${amount} from ${from.address} to ${signer.address}`);
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
