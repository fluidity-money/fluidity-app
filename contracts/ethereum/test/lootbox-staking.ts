
// these tests are only available on arbitrum

import * as hre from "hardhat";

import { ethers, BigNumber, BigNumberish } from "ethers";

import {
  SUSHISWAP_FACTORY,
  SUSHISWAP_ROUTER,
  CAMELOT_FACTORY,
  CAMELOT_ROUTER } from "./arbitrum-constants";

import { signers, commonFactories } from "./setup-common";

import { advanceTime, sendEmptyTransaction } from "./test-utils";

import { expect, assert } from "chai";

const MaxUint256 = ethers.constants.MaxUint256;

const slippage = 10;

const createPair = async (
  factory: ethers.Contract,
  token0: ethers.Contract,
  token1: ethers.Contract
): Promise<ethers.Contract> => {
  const addr = await factory.callStatic.createPair(token0.address, token1.address);
  await factory.createPair(token0.address, token1.address);
  return hre.ethers.getContractAt("TestUniswapV2Pair", addr);
};

const expectWithinSlippage = (
  base: BigNumberish,
  test: BigNumberish,
  slippage: BigNumberish
) =>
  assert(
    BigNumber.from(base).sub(BigNumber.from(base)).mul(slippage).div(100).lte(test),
    `${base} - (${base} * ${slippage} / 100) >= ${test} not true!`
  );

const deposit = async (
  contract: ethers.Contract,
  lockupLength: number,
  maxFusdcAmount: BigNumberish,
  maxUsdcAmount: BigNumberish,
  maxWethAmount: BigNumberish,
  slippageTolerance: BigNumberish
): Promise<[BigNumber, BigNumber, BigNumber]> => {
  const { fusdcDeposited, usdcDeposited, wethDeposited } =
    await contract.callStatic.deposit(
      lockupLength,
      maxFusdcAmount,
      maxUsdcAmount,
      maxWethAmount,
      slippageTolerance
    );

  await contract.deposit(
    lockupLength,
    maxFusdcAmount,
    maxUsdcAmount,
    maxWethAmount,
    slippageTolerance
  );

  return [ fusdcDeposited, usdcDeposited, wethDeposited ];
};

const redeem = async (
  contract: ethers.Contract,
  fusdcAmount: BigNumberish,
  usdcAmount: BigNumberish,
  wethAmount: BigNumberish,
  slippage: number
): Promise<[ BigNumber, BigNumber, BigNumber ]> => {
  const { fusdcRemaining, usdcRemaining, wethRemaining } =
    await contract.callStatic.redeem(fusdcAmount, usdcAmount, wethAmount, slippage);

  await contract.redeem(fusdcAmount, usdcAmount, wethAmount, slippage);

  return [ fusdcRemaining, usdcRemaining, wethRemaining ];
};

const expectDeposited = async (
  contract: ethers.Contract,
  fusdc: BigNumberish,
  usdc: BigNumberish,
  weth: BigNumberish
): Promise<void> => {
  const [ fusdcDeposited, usdcDeposited, wethDeposited ] = await contract.deposited(
    await contract.signer.getAddress()
  );

  expect(fusdcDeposited, "deposited fusdc").to.be.equal(fusdc);
  expect(usdcDeposited, "deposited usdc").to.be.equal(usdc);
  expect(wethDeposited, "deposited weth").to.be.equal(weth);
};

describe("LootboxStaking", async () => {
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
      MaxUint256
    );

    token1 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 1",
      18,
      MaxUint256
    );

    token2 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 2",
      18,
      MaxUint256
    );

    const sushiswapFactory = await hre.ethers.getContractAt(
      "TestUniswapV2Factory",
      SUSHISWAP_FACTORY
    );

    sushiswapRouter = await hre.ethers.getContractAt(
      "TestUniswapV2Router",
      SUSHISWAP_ROUTER
    );

    sushiswapToken1Pair = await createPair(sushiswapFactory, token0, token1);

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

    staking = await stakingFactory.connect(stakingSigner).deploy();

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

    await token0.approve(staking.address, MaxUint256);
    await token1.approve(staking.address, MaxUint256);
    await token2.approve(staking.address, MaxUint256);
  });

  it("should lock up 20000 test token 1 and 20000 test token 2", async() => {
    const depositToken = 20000;

    const [ fusdc, usdc, weth ] = await deposit(
      staking,
      8640000,
      depositToken,
      depositToken,
      0,
      slippage
    );

    expectWithinSlippage(depositToken, fusdc, slippage);

    expectWithinSlippage(depositToken, usdc, slippage);

    expectWithinSlippage(depositToken, weth, slippage);

    await expectDeposited(staking, fusdc, usdc, weth);

    await advanceTime(hre, 8640005);

    await sendEmptyTransaction(stakingSigner);

    const [ fusdcRemaining, usdcRemaining, wethRemaining ] = await redeem(
      staking,
      fusdc,
      usdc,
      weth,
      slippage
    );

    expect(fusdcRemaining, "fusdc").to.be.equal(0);

    expect(usdcRemaining, "usdc").to.be.equal(0);

    expect(wethRemaining, "weth").to.be.equal(0);
  });

  it("should lock up two amounts then redeem them", async() => {
    const depositFusdc = 25000;
    const depositUsdc = 27000;

    const [ fusdc, usdc, weth ] = await deposit(
      staking,
      8640000,
      depositFusdc,
      depositUsdc,
      0,
      slippage
    );

    expectWithinSlippage(depositFusdc, fusdc, slippage);

    expectWithinSlippage(depositUsdc, usdc, slippage);

    await expectDeposited(staking, fusdc, usdc, weth);

    const [ fusdc1, usdc1 ] = await deposit(
      staking,
      8640000,
      depositFusdc,
      depositUsdc,
      0,
      slippage
    );

    expectWithinSlippage(depositFusdc, fusdc1, slippage);

    expectWithinSlippage(depositUsdc, usdc1, slippage);

    await expectDeposited(staking, fusdc.add(fusdc1), usdc.add(usdc1), 0);

    await advanceTime(hre, 8640004);

    await sendEmptyTransaction(stakingSigner);

    const r = await redeem(
      staking,
      fusdc.add(fusdc1),
      usdc.add(usdc1),
      0,
      slippage
    );

    const [ fusdcRemaining, usdcRemaining, wethRemaining ] = r;

    expect(fusdcRemaining, "fusdc remaining after redeem").to.be.equal(0);

    expect(usdcRemaining, "usdc redeeming after redeem").to.be.equal(0);

    expect(wethRemaining, "weth redeeming after redeem").to.be.equal(0);
  });

  it("should lock up three amounts and redeem only two, then test the deposit at the end", async() => {
    const depositFusdc = 25000;
    const depositUsdc = 27000;

    const [ fusdc, usdc, weth ] = await deposit(
      staking,
      8640000,
      depositFusdc,
      depositUsdc,
      0,
      slippage
    );

    expectWithinSlippage(depositFusdc, fusdc, slippage);

    expectWithinSlippage(depositUsdc, usdc, slippage);

    await expectDeposited(staking, fusdc, usdc, weth);

    const [ fusdc1, usdc1 ] = await deposit(
      staking,
      8640000,
      depositFusdc,
      depositUsdc,
      0,
      slippage
    );

    expectWithinSlippage(depositFusdc, fusdc1, slippage);

    expectWithinSlippage(depositUsdc, usdc1, slippage);

    const [ fusdc2, usdc2 ] = await deposit(
      staking,
      8640000,
      depositFusdc,
      depositUsdc,
      0,
      slippage
    );

    expectWithinSlippage(depositFusdc, fusdc2, slippage);

    expectWithinSlippage(depositUsdc, usdc2, slippage);

    await advanceTime(hre, 8640004);

    await sendEmptyTransaction(stakingSigner);

    const [ fusdcRemaining, usdcRemaining ] = await redeem(
      staking,
      fusdc.add(fusdc1),
      usdc.add(usdc1),
      0,
      slippage
    );

    expect(fusdcRemaining).to.be.equal(0);

    expect(usdcRemaining).to.be.equal(0);

    await expectDeposited(staking, fusdc2, usdc2, 0);
  });
});
