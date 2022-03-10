import hre from 'hardhat';
const ethers = hre.ethers;
import "@nomiclabs/hardhat-waffle";
import {promisify} from 'util';
import {USDT_ADDR, USUAL_FUSDT_ADDR} from '../test-constants';
import {readFile as readFileCB} from 'fs';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
const readFile = promisify(readFileCB);

//try to convert USDT to fUSDT with all 10 test accounts
async function main() {
  const promises: Promise<void>[] = [];
  (await ethers.getSigners())
    .forEach(signer => promises.push(makeTxn(signer)))
  return Promise.allSettled(promises);
}
async function makeTxn(testAccount: SignerWithAddress) {
  const IERC20 = await readFile('./artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol/IERC20Upgradeable.json').then(res => JSON.parse('' + res)).catch(e => console.log(e));
    const token = (await ethers.getContractFactory("TokenCompound"))
      .attach(USUAL_FUSDT_ADDR)
      .connect(testAccount);
    const impersonatedUsdt = new ethers.Contract(
      USDT_ADDR,
      IERC20.abi,
      testAccount
    );
    console.log(`account ${testAccount.address} has USDT balance ${(await impersonatedUsdt.balanceOf(testAccount.address))._hex}`)
    const amount = ethers.utils.parseUnits("1000",6);
  const {_hex} = await impersonatedUsdt.allowance(testAccount.address, token.address)
  if (Number(_hex) < Number(amount.toHexString())){
      const a = await impersonatedUsdt.approve(USUAL_FUSDT_ADDR, amount)
      await a.wait();
      console.log("increasing allowance...",testAccount.address)
  } else
    console.log("allowance already sufficient, continuing...",testAccount.address,_hex)


  console.log("d",testAccount.address)
  try {
      const res = await token.erc20In(amount);
      await res.wait()
      console.log("erc20in receipt",res)
  } catch (e) {
      console.log("failed to call erc20in",e)
  }
  console.log("finished",testAccount.address)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
