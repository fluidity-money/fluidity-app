import * as hre from "hardhat";

before(async function() {
  await hre.run("forknet:take-usdt");
});
