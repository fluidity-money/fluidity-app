import hre from 'hardhat';
const ethers = hre.ethers;
import "@nomiclabs/hardhat-waffle";
import {USUAL_FUSDT_ADDR} from '../test-constants';

//make a transfer of 10 fUSDT from accounts[0] -> accounts[1]
async function main() {
  const [from, to] = (await ethers.getSigners())

  const token = (await ethers.getContractFactory("Token"))
    .attach(USUAL_FUSDT_ADDR)
    .connect(from);

  const amount = ethers.utils.parseUnits("10",6);
  const res = await token.transfer(to.address, amount);
  await res.wait();
  console.log("made trasnfer",res);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
