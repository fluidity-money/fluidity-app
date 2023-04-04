
import * as hre from "hardhat";

const main = async () => {
  const token = await hre.ethers.getContractAt("Token", "");
  console.log(await token.callStatic.getUtilityVars());
};

main().then(_ => console.log("done"));
