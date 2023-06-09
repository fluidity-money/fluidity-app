
import * as hre from "hardhat";

import type { HardhatRuntimeEnvironment } from "hardhat/types";

import { ethers, BigNumber } from "ethers";

import { CAMELOT_ROUTER, CAMELOT_FACTORY } from "../test/arbitrum-constants";

import { getLatestTimestamp } from "../script-utils";

const MaxUint256 = ethers.constants.MaxUint256;

const NullAddress = "0x0000000000000000000000000000000000000000";

const getFutureTimestamp = async (hre: HardhatRuntimeEnvironment): Promise<number> => {
  return (await getLatestTimestamp(hre)) + 100000000;
}

const main = async () => {
  const rootSignerAddress = await (await hre.ethers.getSigners())[0].getAddress();

  const tokenFactory = await hre.ethers.getContractFactory("GovToken");

  const token0 = await tokenFactory.deploy(
    "Staking test token",
    "token 0",
    18,
    MaxUint256
  );

  const token1 = await tokenFactory.deploy(
    "Staking test token",
    "token 1",
    18,
    MaxUint256
  );

  await token0.approve(CAMELOT_ROUTER, MaxUint256);
  await token1.approve(CAMELOT_ROUTER, MaxUint256);

  const camelotRouter = await hre.ethers.getContractAt(
    "TestCamelotRouter",
    CAMELOT_ROUTER
  );

  const amount = BigNumber.from("1000000000000000000000");

  let future = await getFutureTimestamp(hre);

  await camelotRouter.addLiquidity(
    token0.address, // token a
    token1.address, // token b
    amount, // amount a desired
    amount, // amount b desired
    amount, // amount a min
    amount, // amount b min
    rootSignerAddress, // to
    future // deadline
  );

  const camelotFactory = await hre.ethers.getContractAt(
    "TestCamelotFactory",
    CAMELOT_FACTORY
  );

  console.log(`camelot pair token 0 ${token0.address}, token 1 ${token1.address}`);

  const camelotPairAddress = await camelotFactory.getPair(token0.address, token1.address);

  const camelotPair = await hre.ethers.getContractAt(
    "TestCamelotPair",
    camelotPairAddress
  );

  console.log(`camelot pair: ${camelotPair}, camelot router ${camelotRouter.address}`);

  await token0.approve(camelotPair.address, MaxUint256);
  await token1.approve(camelotPair.address, MaxUint256);

  future = await getFutureTimestamp(hre);

  console.log(`balance of token 0: ${token0.balanceOf(rootSignerAddress)}`);
  console.log(`balance of token 1: ${token1.balanceOf(rootSignerAddress)}`);

  await camelotRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
    BigNumber.from("90000000000000"), // amount in
    BigNumber.from("70000000000000"), // amount out
    [token0.address, token1.address], // paths
    rootSignerAddress, // to
    NullAddress, // referrer address
    future // deadline
  );
};

main().then(_ => {});
