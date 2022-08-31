import hre from 'hardhat';
const ethers = hre.ethers;
import "@nomiclabs/hardhat-waffle";
import {USDT_ADDR, USUAL_FUSDT_ADDR} from '../test-constants';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import { optionalEnv } from '../script-utils';

const EnvTokenAddress = `FLU_ETHEREUM_TOKEN_CONTRACT_ADDRESS`;
const EnvUnderlyingAddress = `FLU_ETHEREUM_UNDERLYING_CONTRACT_ADDRESS`;

const tokenAddress = optionalEnv(EnvTokenAddress, USUAL_FUSDT_ADDR);
const underlyingAddress = optionalEnv(EnvUnderlyingAddress, USDT_ADDR);

//try to convert USDT to fUSDT with all 10 test accounts
async function main() {
  const promises: Promise<void>[] = [];

  const signers = (await ethers.getSigners()).slice(0, 10);
  for (const signer of signers) {
    promises.push(makeTxn(signer));
  }

  return Promise.allSettled(promises);
}

async function makeTxn(account: SignerWithAddress) {
  const token = await hre.ethers.getContractAt(
    tokenAddress,
    "Token",
    account
  );
  const usdt = await hre.ethers.getContractAt(
    underlyingAddress,
    "IERC20",
    account
  );

  const balance = await token.balanceOf(account.address);
  console.log(`account ${account.address} has USDT balance ${balance.toString()}`)

  const allowance = await usdt.allowance(account.address, token.address)
  if (allowance.lt(balance)) {
    console.log(`increasing allowance for ${account.address}...`);
    const a = await usdt.approve(USUAL_FUSDT_ADDR, balance);
    await a.wait();
  } else {
    console.log(`allowance for ${account.address} already sufficient, continuing...`);
  }

  try {
    console.log(`account ${account.address} calling erc20in...`);
    const res = await token.erc20In(balance);
    await res.wait()
    console.log("erc20in receipt", res)
  } catch (e) {
    console.log("failed to call erc20in", e)
  }
  console.log("finished", account.address)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
