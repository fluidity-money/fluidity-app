import hre from 'hardhat';
const ethers = hre.ethers;
import "@nomiclabs/hardhat-waffle";
import {CUSDT_ADDR, USDT_ADDR, USUAL_FUSDT_ADDR} from '../test-constants';
import {readFile as readFilePromise} from 'fs';
import {promisify} from 'util';
const readFile = promisify(readFilePromise);

//make a transfer of 10 fUSDT from accounts[0] -> accounts[1]
async function main() {
  const [from] = (await ethers.getSigners())

  const IERC20 = await readFile('./artifacts/contracts/openzeppelin-erc20/IERC20.sol/IERC20.json')
    .then(res => JSON.parse('' + res));
  const ICOMPOUND = await readFile('./artifacts/contracts/compound/CTokenInterfaces.sol/CErc20Interface.json')
    .then(res => JSON.parse('' + res));

  const cUSDt = new hre.ethers.Contract(
    CUSDT_ADDR,
    ICOMPOUND.abi,
    from,
  );
  const USDt = new hre.ethers.Contract(
    USDT_ADDR,
    IERC20.abi,
    from,
  );
  const fUSDt = (await ethers.getContractFactory("TokenCompound"))
    .attach(USUAL_FUSDT_ADDR)
    .connect(from);

  if ((await USDt.allowance(from.address, CUSDT_ADDR)).isZero()) {
    console.log(`approving USDt -> cUSDt`);
    await (await USDt.approve(CUSDT_ADDR, ethers.constants.MaxUint256)).wait();
  } else {
    console.log(`us -> cUSDt allowance is already set...`);
  }
  console.log(`minting cUSDt`);
  const res = await cUSDt.mint(ethers.utils.parseUnits("50000", 6));
  await res.wait();

  console.log(`xfering cUSDt`);
  const res2 = await cUSDt.transfer(USUAL_FUSDT_ADDR, await cUSDt.balanceOf(from.address)); // change this !!
  await res2.wait();

  console.log("made trasnfer",res);
  console.log("rp bal: ", await fUSDt.callStatic.rewardPoolAmount(), " (*10e-9)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
