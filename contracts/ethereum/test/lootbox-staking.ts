
// these tests are only available on arbitrum

import * as hre from "hardhat";

import { ethers, BigNumber, BigNumberish } from "ethers";

import {
  CAMELOT_FACTORY,
  CAMELOT_ROUTER,
  SUSHISWAP_STABLE_POOL_FACTORY,
  SUSHISWAP_MASTER_DEPLOYER,
  SUSHISWAP_BENTO_BOX } from "./arbitrum-constants";

import { signers, commonFactories } from "./setup-common";

import { advanceTime, sendEmptyTransaction } from "./test-utils";

import { expect, assert } from "chai";

const MaxUint256 = ethers.constants.MaxUint256;

const MINIMUM_DEPOSIT = BigNumber.from("10").pow(18).mul(2);

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
  lockupLength: BigNumberish,
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
      slippageTolerance,
      0
    );

  await contract.deposit(
    lockupLength,
    maxFusdcAmount,
    maxUsdcAmount,
    maxWethAmount,
    slippageTolerance,
    0
  );

  return [ fusdcDeposited, usdcDeposited, wethDeposited ];
};

const redeem = async (
  contract: ethers.Contract,
): Promise<[ BigNumber, BigNumber, BigNumber ]> => {
  const { fusdcRedeemed, usdcRedeemed, wethRedeemed } =
    await contract.callStatic.redeem(0);

  await contract.redeem(0);

  return [ fusdcRedeemed, usdcRedeemed, wethRedeemed ];
};

const expectDeposited = async (
  contract: ethers.Contract,
  fusdc: BigNumberish,
  usdc: BigNumberish,
  weth: BigNumberish
): Promise<void> => {
  const [ fusdcDeposited, usdcDeposited, wethDeposited ] =
    await contract.deposited(contract.signer.getAddress());

  expect(fusdcDeposited, "deposited fusdc").to.be.equal(fusdc);
  expect(usdcDeposited, "deposited usdc").to.be.equal(usdc);
  expect(wethDeposited, "deposited weth").to.be.equal(weth);
};

const expectRedeemableWithDrift = async (
  contract: ethers.Contract,
  fusdc: BigNumberish,
  usdc: BigNumberish,
  weth: BigNumberish
): Promise<void> => {
  const [ fusdcRedeemable, usdcRedeemable, wethRedeemable ] =
    await contract.redeemable(contract.signer.getAddress());

  expectWithinSlippage(fusdcRedeemable, fusdc, 10);
  expectWithinSlippage(usdcRedeemable, usdc, 10);
  expectWithinSlippage(wethRedeemable, weth, 10);
};

const deployPool = async (
  masterDeployer: ethers.Contract,
  tokenAAddress: string,
  tokenBAddress: string,
  fee: number
): Promise<ethers.Contract> => {
  const enc = ethers.utils.defaultAbiCoder.encode(
    [ "address", "address", "uint256" ],
    [ tokenAAddress, tokenBAddress, fee ]
  );

  const addr = await masterDeployer.callStatic.deployPool(
    SUSHISWAP_STABLE_POOL_FACTORY,
    enc
  );

  await masterDeployer.deployPool(
    SUSHISWAP_STABLE_POOL_FACTORY,
    enc
  );

  return await hre.ethers.getContractAt(
    "TestSushiswapStablePool",
    addr
  );
};

describe("LootboxStaking", async () => {
  let stakingSigner: ethers.Signer;

  let stakingSignerAddress: string;

  let erc20TokenFactory: ethers.ContractFactory;

  let token0: ethers.Contract;

  let token1: ethers.Contract;

  let token2: ethers.Contract;

  let sushiswapToken1Pool: ethers.Contract;

  let sushiswapToken2Pool: ethers.Contract;

  let staking: ethers.Contract;

  let camelotRouter: ethers.Contract;

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

    const sushiswapMasterDeployer = await hre.ethers.getContractAt(
      "TestSushiswapMasterDeployer",
      SUSHISWAP_MASTER_DEPLOYER
    );

    sushiswapToken1Pool = await deployPool(
      sushiswapMasterDeployer,
      token0.address,
      token1.address,
      30 // 0.3%
    );

    sushiswapToken2Pool = await deployPool(
      sushiswapMasterDeployer,
      token0.address,
      token2.address,
      30 // 0.3%
    );

    const sushiswapToken1PoolAddress = sushiswapToken1Pool.address;

    const sushiswapToken2PoolAddress = sushiswapToken2Pool.address;

    staking = await stakingFactory.connect(stakingSigner).deploy();

    stakingSignerAddress = await stakingSigner.getAddress();

    await staking.connect(stakingSigner).init(
      stakingSignerAddress,
      stakingSignerAddress,
      token0.address,
      token1.address,
      token2.address,
      camelotRouter.address,
      SUSHISWAP_BENTO_BOX,
      camelotToken1PairAddress,
      camelotToken2PairAddress,
      sushiswapToken1PoolAddress,
      sushiswapToken2PoolAddress
    );

    await token0.approve(staking.address, MaxUint256);
    await token1.approve(staking.address, MaxUint256);
    await token2.approve(staking.address, MaxUint256);
  });

  it("should lock up 2000000 test token 1 and 2000000 test token 2", async() => {
    const depositToken = MINIMUM_DEPOSIT;

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

    const [ fusdcRedeemed, usdcRedeemed, wethRedeemed ] = await redeem(staking);

    expectWithinSlippage(fusdcRedeemed, fusdc, 10);

    expectWithinSlippage(usdcRedeemed, usdc, 10);

    expectWithinSlippage(wethRedeemed, weth, 10);

    await expectDeposited(staking, 0, 0, 0);
  });

  it("should lock up two amounts then redeem them", async() => {
    const depositFusdc = MINIMUM_DEPOSIT;
    const depositUsdc = MINIMUM_DEPOSIT;

    expectDeposited(staking, 0, 0, 0);

    const token0BeforeDeposit = await token0.balanceOf(stakingSignerAddress);
    const token1BeforeDeposit = await token1.balanceOf(stakingSignerAddress);
    const token2BeforeDeposit = await token2.balanceOf(stakingSignerAddress);

    const [ fusdc, usdc, weth ] = await deposit(
      staking,
      8640000,
      depositFusdc,
      depositUsdc,
      0,
      slippage
    );

    expect(await token0.balanceOf(stakingSignerAddress))
      .to.be.equal(token0BeforeDeposit.sub(fusdc));

    expect(await token1.balanceOf(stakingSignerAddress))
      .to.be.equal(token1BeforeDeposit.sub(usdc));

    expect(await token2.balanceOf(stakingSignerAddress))
      .to.be.equal(token2BeforeDeposit.sub(weth));

    expectWithinSlippage(depositFusdc, fusdc, slippage);

    expectWithinSlippage(depositUsdc, usdc, slippage);

    await expectDeposited(staking, fusdc, usdc, weth);

    const [ fusdc1, usdc1, weth1 ] = await deposit(
      staking,
      8640000,
      depositFusdc,
      depositUsdc,
      0,
      slippage
    );

    expect(await token0.balanceOf(stakingSignerAddress))
      .to.be.equal(token0BeforeDeposit.sub(fusdc).sub(fusdc1));

    expect(await token1.balanceOf(stakingSignerAddress))
      .to.be.equal(token1BeforeDeposit.sub(usdc).sub(usdc1));

    expect(await token2.balanceOf(stakingSignerAddress))
      .to.be.equal(token2BeforeDeposit.sub(weth).sub(weth1));

    expectWithinSlippage(depositFusdc, fusdc1, slippage);

    expectWithinSlippage(depositUsdc, usdc1, slippage);

    await expectDeposited(staking, fusdc.add(fusdc1), usdc.add(usdc1), 0);

    await advanceTime(hre, 8640004);

    await sendEmptyTransaction(stakingSigner);

    const token0BeforeRedeem = await token0.balanceOf(stakingSignerAddress);
    const token1BeforeRedeem = await token1.balanceOf(stakingSignerAddress);
    const token2BeforeRedeem = await token2.balanceOf(stakingSignerAddress);

    const [ fusdcRedeemed, usdcRedeemed, wethRedeemed ] = await redeem(staking);

    // test if the amount added to the account is within the range of 10%,
    // assuming some fees were paid

    expectWithinSlippage(
      token0BeforeRedeem,
      token0BeforeRedeem.add(fusdcRedeemed),
      10
    );

    expectWithinSlippage(
      token1BeforeRedeem,
      token1BeforeRedeem.add(usdcRedeemed),
      10
    );

    expectWithinSlippage(
      token2BeforeRedeem,
      token2BeforeRedeem.add(wethRedeemed),
      10
    );

    expectWithinSlippage(fusdcRedeemed, fusdc.add(fusdc1), 10);

    expectWithinSlippage(usdcRedeemed, usdc.add(usdc1), 10);

    expectWithinSlippage(wethRedeemed, weth.add(weth1), 10);

    await expectDeposited(staking, 0, 0, 0);
  });

  it("should fail to deposit usdc/weth together", async () => {
    expect(deposit(staking, 9999999, 1, 2, 3, slippage))
      .to.be.revertedWith("not enough liquidity");

    await expectDeposited(staking, 0, 0, 0);
  });

  it("should fail when the lockup time is too low", async () => {
    expect(deposit(staking, 1, 1, 0, 3, slippage))
      .to.be.revertedWith("lockup length too low");

    await expectDeposited(staking, 0, 0, 0);
  });

  it("should fail when the lockup time is too high", async () => {
    expect(deposit(staking, MaxUint256, 1, 0, 3, slippage))
      .to.be.revertedWith("lockup length too high");

    await expectDeposited(staking, 0, 0, 0);
  });

  it("should fail to redeem weth early", async () => {
    const [ fusdc, usdc, weth ] = await deposit(
      staking,
      9999999,
      MINIMUM_DEPOSIT,
      0,
      MINIMUM_DEPOSIT,
      slippage
    );

    await expectRedeemableWithDrift(staking, fusdc, usdc, weth);

    await sendEmptyTransaction(stakingSigner);

    expect(redeem(staking)).to.be.revertedWith("swag");

    await advanceTime(hre, 99999999);

    const [ fusdcRedeemed, usdcRedeemed, wethRedeemed ] = await redeem(staking);

    expectWithinSlippage(fusdcRedeemed, fusdc, 10);

    expectWithinSlippage(usdcRedeemed, usdc, 10);

    expectWithinSlippage(wethRedeemed, weth, 10);

    await expectDeposited(staking, 0, 0, 0);
  });

  it(
    "should succeed in draining multiple amounts that are fusdc/weth/usdc",
    async () => {
      await expectDeposited(staking, 0, 0, 0);

      const depositFusdc = MINIMUM_DEPOSIT;
      const depositWeth = MINIMUM_DEPOSIT;

      const [ fusdc, _usdc, weth ] = await deposit(
        staking,
        8640000,
        depositFusdc,
        0,
        depositWeth,
        slippage
      );

      expectWithinSlippage(depositFusdc, fusdc, slippage);

      expectWithinSlippage(depositWeth, weth, slippage);

      const depositUsdc = MINIMUM_DEPOSIT;

      const [ fusdc1, usdc ] = await deposit(
        staking,
        8640000,
        depositFusdc,
        depositUsdc,
        0,
        slippage
      );

      await sendEmptyTransaction(stakingSigner);

      expectWithinSlippage(depositFusdc, fusdc1, slippage);

      expectWithinSlippage(depositUsdc, usdc, slippage);

      await advanceTime(hre, 8640004);

      await sendEmptyTransaction(stakingSigner);

      const [ fusdcRedeemable, usdcRedeemable, wethRedeemable ] =
        await staking.redeemable(stakingSigner.getAddress());

      expectWithinSlippage(fusdcRedeemable, fusdc.add(fusdc1), 10);

      expectWithinSlippage(usdcRedeemable, usdc, 10);

      expectWithinSlippage(wethRedeemable, weth, 10);

      await expectDeposited(staking, fusdc.add(fusdc1), usdc, weth);

      const [ fusdcRedeemed, usdcRedeemed, wethRedeemed ] = await redeem(staking);

      expectWithinSlippage(fusdcRedeemed, fusdc.add(fusdc1), 10);

      expectWithinSlippage(usdcRedeemed, usdc, 10);

      expectWithinSlippage(wethRedeemed, weth, 10);

      await expectDeposited(staking, 0, 0, 0);
    }
  );

  it(
    "should support camelot people making trades with the pool and collecting their fees",
    async () => {}
  );

  it("should support tracking ratios correctly", async () => {
      await expectDeposited(staking, 0, 0, 0);

      const depositFusdc = MINIMUM_DEPOSIT;
      const depositWeth = MINIMUM_DEPOSIT;

      const [ fusdc, _usdc, weth ] = await deposit(
        staking,
        8640000,
        depositFusdc,
        0,
        depositWeth,
        slippage
      );

      const testSupplierFactory = await hre.ethers.getContractFactory(
        "TestSushiswapSupplyToken"
      );

      const testSupplier = await testSupplierFactory.deploy(
        token0.address,
        token1.address,
        SUSHISWAP_BENTO_BOX,
        sushiswapToken1Pool.address
      );

      const fusdcOutOfWhackAmount = MINIMUM_DEPOSIT;

      const usdcOutOfWhackAmount = MINIMUM_DEPOSIT.mul(2);

      await token0.approve(testSupplier.address, fusdcOutOfWhackAmount);

      await token1.approve(testSupplier.address, usdcOutOfWhackAmount);

      await testSupplier.deposit(fusdcOutOfWhackAmount, usdcOutOfWhackAmount);

      console.log(`ratios: ${await staking.ratios()}`);
  });
});
