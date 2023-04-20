
// these tests are only available on arbitrum

import * as hre from "hardhat";

import { ethers } from "ethers";

import {
  SUSHISWAP_FACTORY,
  SUSHISWAP_ROUTER,
  CAMELOT_FACTORY,
  CAMELOT_ROUTER } from "./arbitrum-constants";

import { signers, commonFactories } from "./setup-common";

import { advanceTime } from "./test-utils";

// TODO randomise for each token
const tokenAmount = 100000;

const createPair = async (
  factory: ethers.Contract,
  token0: ethers.Contract,
  token1: ethers.Contract
): Promise<ethers.Contract> => {
  const addr = await factory.callStatic.createPair(token0.address, token1.address);
  await factory.createPair(token0.address, token1.address);
  return hre.ethers.getContractAt("TestUniswapV2Pair", addr);
};

describe("Staking", async () => {
  let stakingSigner: ethers.Signer;

  let erc20TokenFactory: ethers.ContractFactory;

  let token0: ethers.Contract;

  let token1: ethers.Contract;

  let token2: ethers.Contract;

  let sushiswapRouter: ethers.Contract;

  let staking: ethers.Contract;

  let camelotRouter: ethers.Contract;

  let sushiswapToken1Pair: ethers.Contract;

  let sushiswapToken2Pair: ethers.Contract;

  let camelotToken1Pair: ethers.Contract;

  let camelotToken2Pair: ethers.Contract;

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK != "arbitrum")
      this.skip();

    ({ userAccount1: stakingSigner } = signers);

    erc20TokenFactory = commonFactories.govToken;

    const stakingFactory = commonFactories.staking;

    token0 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 0",
      18,
      tokenAmount
    );

    console.log(`token 0: ${token0.address}`);

    token1 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 1",
      18,
      tokenAmount
    );

    console.log(`token 1: ${token1.address}`);

    token2 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 2",
      18,
      tokenAmount
    );

    console.log(`token 2: ${token2.address}`);

    const sushiswapFactory = await hre.ethers.getContractAt(
      "TestUniswapV2Factory",
      SUSHISWAP_FACTORY
    );

    sushiswapRouter = await hre.ethers.getContractAt(
      "TestUniswapV2Router",
      SUSHISWAP_ROUTER
    );

    console.log(`about to create sushiswap token 1 pair, factory: ${sushiswapFactory.address}`);

    sushiswapToken1Pair = await createPair(sushiswapFactory, token0, token1);

    console.log(`sushiswap token 1 pair: ${sushiswapToken1Pair}`);

    const sushiswapToken1PairAddress = sushiswapToken1Pair.address;

    sushiswapToken2Pair = await createPair(sushiswapFactory, token0, token2);

    const sushiswapToken2PairAddress = sushiswapToken2Pair.address;

    const camelotFactory = await hre.ethers.getContractAt(
      "TestUniswapV2Factory",
      CAMELOT_FACTORY
    );

    camelotRouter = await hre.ethers.getContractAt(
      "TestUniswapV2Router",
      CAMELOT_ROUTER
    );

    camelotToken1Pair = await createPair(camelotFactory, token0, token1);

    const camelotToken1PairAddress = camelotToken1Pair.address;

    camelotToken2Pair = await createPair(camelotFactory, token0, token2);

    const camelotToken2PairAddress = camelotToken2Pair.address;

    console.log(`testing infra token 0 token 1 pair: ${await camelotFactory.getPair(token0.address, token1.address)}`);

    console.log(`camelot token 1 pair address: ${camelotToken1PairAddress}`);

    console.log(`camelot token 2 pair address: ${camelotToken2PairAddress}`);

    staking = await stakingFactory.connect(stakingSigner).deploy();

    console.log(`staking signer: ${await stakingSigner.getAddress()}`);

    await staking.connect(stakingSigner).init(
      token0.address,
      token1.address,
      token2.address,
      camelotRouter.address,
      sushiswapRouter.address,
      camelotToken1PairAddress,
      camelotToken2PairAddress,
      sushiswapToken1PairAddress,
      sushiswapToken2PairAddress,
    );

    console.log(`staking address: ${staking.address}`);

    await token0.approve(staking.address, tokenAmount);
    await token1.approve(staking.address, tokenAmount);
    await token2.approve(staking.address, tokenAmount);
  });

  it("should lock up 100 test token 1 and test token 2", async() => {
    await staking.deposit(8640000, tokenAmount, tokenAmount, 0);
    console.log(await staking.deposited());
    console.log(`balance of staking lp token: ${await camelotToken1Pair.balanceOf(staking.address)}`);
    await advanceTime(hre, 9640001);
    await staking.redeem(tokenAmount, tokenAmount, 0);
    console.log(await staking.deposited());
  });
});
