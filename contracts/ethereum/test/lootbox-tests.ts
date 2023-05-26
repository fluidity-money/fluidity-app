
import * as hre from "hardhat";

import { ethers, BigNumber } from "ethers";

import { advanceTime, sendEmptyTransaction } from "./test-utils";

import { getLatestTimestamp } from "../script-utils";

import { expect } from "chai";

import {
  expectWithinSlippage,
  deposit,
  redeem,
  pickRandomBalance,
  pickRatio,
  expectDeposited } from "../lootbox-utils";

const MaxUint256 = ethers.constants.MaxUint256;

const slippage = 30;

export type lootboxTestsArgs = {
  stakingSigner: ethers.Signer,
  stakingSignerAddress: string,
  token0: ethers.Contract,
  token1: ethers.Contract,
  token2: ethers.Contract,
  sushiswapTridentRouter: ethers.Contract,
  sushiswapToken1Pool: ethers.Contract,
  sushiswapToken2Pool: ethers.Contract,
  staking: ethers.Contract,
  camelotRouter: ethers.Contract,
  camelotToken1Pair: ethers.Contract,
  camelotToken2Pair: ethers.Contract
};

const LootboxTests = async (
  args: lootboxTestsArgs,
  minimumDeposit: BigNumber
) => {
  it("should lock up 2000000 test token 1 and 2000000 test token 2", async() => {
    const { stakingSigner, staking } = args;

    const {
      fusdcForUsdc: fusdcDeposit,
      usdc: usdcDeposit
    } = await pickRatio(staking, 2000000, 2000000, 0);

    const [ fusdc, usdc, weth ] = await deposit(
      staking,
      8640000,
      fusdcDeposit,
      usdcDeposit,
      0,
      slippage
    );

    expectWithinSlippage(fusdcDeposit, fusdc, slippage);

    expectWithinSlippage(usdcDeposit, usdc, slippage);

    await advanceTime(hre, 8640005);

    await sendEmptyTransaction(stakingSigner);

    const [ fusdcRedeemed, usdcRedeemed, wethRedeemed ] = await redeem(staking);

    expectWithinSlippage(fusdcRedeemed, fusdc, 10);

    expectWithinSlippage(usdcRedeemed, usdc, 10);

    expectWithinSlippage(wethRedeemed, weth, 10);
  });

  it("should lock up two amounts then redeem them", async() => {
    const {
      stakingSigner,
      stakingSignerAddress,
      token0,
      token1,
      token2,
      staking,
    } = args;

    let maxFusdc = await pickRandomBalance(token0, minimumDeposit);
    let maxUsdc = await pickRandomBalance(token1, minimumDeposit);

    let { fusdcForUsdc: depositFusdc, usdc: depositUsdc } = await pickRatio(
      staking,
      maxFusdc,
      maxUsdc,
      0
    );

    expectDeposited(staking, 0, 0, 0);

    const token0BeforeDeposit = await token0.balanceOf(stakingSignerAddress);
    const token1BeforeDeposit = await token1.balanceOf(stakingSignerAddress);
    const token2BeforeDeposit = await token2.balanceOf(stakingSignerAddress);

    maxFusdc = await pickRandomBalance(token0, minimumDeposit);
    maxUsdc = await pickRandomBalance(token1, minimumDeposit);

    ({ fusdcForUsdc: depositFusdc, usdc: depositUsdc } = await pickRatio(
      staking,
      maxFusdc,
      maxUsdc,
      0
    ));

    console.log(`depositing fusdc 2: ${depositFusdc}, usdc: ${depositUsdc}, ratios: ${await staking.ratios()}`);

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

    console.log("expecting deposit...");

    await expectDeposited(staking, fusdc, usdc, weth);

    console.log("done expecting");

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
    const { staking } = args;

    expect(deposit(staking, 9999999, 1, 2, 3, slippage))
      .to.be.revertedWith("not enough liquidity");

    await expectDeposited(staking, 0, 0, 0);
  });

  it("should fail when the lockup time is too low", async () => {
    const { staking } = args;

    expect(deposit(staking, 1, 1, 0, 3, slippage))
      .to.be.revertedWith("lockup length too low");

    await expectDeposited(staking, 0, 0, 0);
  });

  it("should fail when the lockup time is too high", async () => {
    const { staking } = args;

    expect(deposit(staking, MaxUint256, 1, 0, 3, slippage))
      .to.be.revertedWith("lockup length too high");

    await expectDeposited(staking, 0, 0, 0);
  });

  it("should fail to redeem weth early", async () => {
    const { stakingSigner, staking, token0, token2 } = args;

    const [ fusdc, usdc, weth ] = await deposit(
      staking,
      9999999,
      await pickRandomBalance(token0, minimumDeposit),
      0,
      await pickRandomBalance(token2, minimumDeposit),
      slippage
    );

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
      const {
        stakingSigner,
        stakingSignerAddress,
        staking,
        token0,
        token1,
        token2
      } = args;

      await expectDeposited(staking, 0, 0, 0);

      // since we're doing this twice

      let availableFusdc = await pickRandomBalance(token0, minimumDeposit);

      const availableUsdc = await pickRandomBalance(token1, minimumDeposit);
      const availableWeth = await token2.balanceOf(stakingSignerAddress);

      console.log(`token 2 signer: ${await token2.signer.getAddress()}`);

      const {
        fusdcForWeth,
        fusdcForUsdc,
        usdc: depositUsdc,
        weth: depositWeth
      } = await pickRatio(
        staking,
        availableFusdc,
        availableUsdc,
        availableWeth
      );

      console.log(`max available fusdc is ${availableFusdc}, max available weth is ${availableWeth} about to supply fusdc ${fusdcForWeth}, supply weth ${depositWeth}`);

      const [ fusdc, _usdc, weth ] = await deposit(
        staking,
        8640000,
        fusdcForWeth,
        0,
        depositWeth,
        slippage
      );

      expectWithinSlippage(fusdcForWeth, fusdc, slippage);

      expectWithinSlippage(depositWeth, weth, slippage);

      console.log("deposit 2");

      const [ fusdc1, usdc ] = await deposit(
        staking,
        8640000,
        fusdcForUsdc,
        depositUsdc,
        0,
        slippage
      );

      console.log("deposit 3");

      await sendEmptyTransaction(stakingSigner);

      expectWithinSlippage(fusdcForUsdc, fusdc1, slippage);

      expectWithinSlippage(depositUsdc, usdc, slippage);

      await advanceTime(hre, 8640004);

      await sendEmptyTransaction(stakingSigner);

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
    async () => {
      const {
        stakingSigner,
        stakingSignerAddress,
        token0,
        token1,
        camelotRouter,
        staking
      } = args;

      const timestamp = await getLatestTimestamp(hre);

      console.log("about to deposit");

      const fusdcDepositAmount = BigNumber.from(100000000000);

      const usdcDepositAmount = BigNumber.from(100000000000);

      const [ fusdcDeposited, usdcDeposited ] = await deposit(
        staking,
        8640000,
        fusdcDepositAmount, // fusdc amount
        usdcDepositAmount, // usdc amount
        0,
        slippage
      );

      // randomly pick which swap to make and just keep going back and
      // forth, swapping the tokens accordingly, to collect fees

      const stakingFusdcBefore = await token0.balanceOf(staking.address);
      const stakingUsdcBefore = await token1.balanceOf(staking.address);

      for (let i = 0; i < 10; i++) {
        const path =
          i % 2
            ? [token0.address, token1.address]
            : [token1.address, token0.address];

        await camelotRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
          1000000000, // amount in
          0, // amount out min
          path, // path
          stakingSignerAddress, // to
          ethers.constants.AddressZero, // referrer
          timestamp + 30000000 // deadline
        );
      }

      await advanceTime(hre, 8640004);

      await sendEmptyTransaction(stakingSigner);

      const [ fusdcRedeemed, usdcRedeemed ] = await redeem(staking);

      expectWithinSlippage(fusdcRedeemed, fusdcDeposited, 10);

      expectWithinSlippage(usdcRedeemed, usdcDeposited, 10);

      const stakingFusdcAfter = await token0.balanceOf(staking.address);
      const stakingUsdcAfter = await token1.balanceOf(staking.address);

      expect(stakingFusdcAfter).to.be.gte(stakingFusdcBefore);
      expect(stakingUsdcAfter).to.be.gt(stakingUsdcBefore);
    }
  );

  it("should support taking fees from sushiswap trades", async () => {
      const {
        stakingSigner,
        stakingSignerAddress,
        token0,
        token1,
        sushiswapTridentRouter,
        sushiswapToken1Pool,
        staking
      } = args;

      const depositFusdc = await pickRandomBalance(token0, minimumDeposit);

      const depositUsdc = await pickRandomBalance(token1, minimumDeposit);

      const [ fusdcDeposited, usdcDeposited ] = await deposit(
        staking,
        8640000,
        depositFusdc,
        depositUsdc,
        0,
        slippage
      );

      // randomly pick which swap to make and just keep going back and
      // forth, swapping the tokens accordingly, to collect fees

      const stakingFusdcBefore = await token0.balanceOf(staking.address);
      const stakingUsdcBefore = await token1.balanceOf(staking.address);

      for (let i = 0; i < 10; i++) {
        const tokenIn = i % 2 ? token0 : token1;

        await sushiswapTridentRouter.exactInputWithNativeToken({
          amountIn: minimumDeposit, // amount in
          amountOutMinimum: minimumDeposit.div(2), // amount out min
          pool: sushiswapToken1Pool,
          data: ethers.utils.defaultAbiCoder.encode(
            [ "address", "address", "bool" ],
            [ tokenIn.address, stakingSignerAddress, true ]
          )
        });
      }

      await advanceTime(hre, 8640004);

      await sendEmptyTransaction(stakingSigner);

      const [ fusdcRedeemed, usdcRedeemed ] = await redeem(staking);

      expectWithinSlippage(fusdcRedeemed, fusdcDeposited, 10);

      expectWithinSlippage(usdcRedeemed, usdcDeposited, 10);

      const stakingFusdcAfter = await token0.balanceOf(staking.address);
      const stakingUsdcAfter = await token1.balanceOf(staking.address);

      expect(stakingFusdcAfter).to.be.gte(stakingFusdcBefore);
      expect(stakingUsdcAfter).to.be.gt(stakingUsdcBefore);});
};

export default LootboxTests;
