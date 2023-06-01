
import * as hre from "hardhat";

import { ethers, BigNumber } from "ethers";

import type { BigNumberish } from "ethers";

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
  sushiswapBentoBox: ethers.Contract,
  staking: ethers.Contract,
  camelotRouter: ethers.Contract,
  camelotToken1Pair: ethers.Contract,
  camelotToken2Pair: ethers.Contract,
  token0Decimals: BigNumberish,
  token1Decimals: BigNumberish,
  token2Decimals: BigNumberish
};

const LootboxTests = async (
  args: lootboxTestsArgs,
  minimumDepositToken1: BigNumber,
  minimumDepositToken2: BigNumber
) => {
  it("should lock up 2000000 test token 1 and 2000000 test token 2", async() => {
    const {
      stakingSigner,
      staking,
      token0Decimals,
      token1Decimals,
      token2Decimals
    } = args;

    const {
      fusdcForUsdc: fusdcDeposit,
      usdc: usdcDeposit
    } = await pickRatio(
      staking,
      2000000,
      2000000,
      0,
      token0Decimals,
      token1Decimals,
      token2Decimals
    );

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
      token0Decimals,
      token1Decimals,
      token2Decimals
    } = args;

    let maxFusdc = await pickRandomBalance(token0, minimumDepositToken1);
    let maxUsdc = await pickRandomBalance(token1, minimumDepositToken1);

    let { fusdcForUsdc: depositFusdc, usdc: depositUsdc } = await pickRatio(
      staking,
      maxFusdc,
      maxUsdc,
      0,
      token0Decimals,
      token1Decimals,
      token2Decimals
    );

    expectDeposited(staking, 0, 0, 0);

    const token0BeforeDeposit = await token0.balanceOf(stakingSignerAddress);
    const token1BeforeDeposit = await token1.balanceOf(stakingSignerAddress);
    const token2BeforeDeposit = await token2.balanceOf(stakingSignerAddress);

    maxFusdc = await pickRandomBalance(token0, minimumDepositToken1);
    maxUsdc = await pickRandomBalance(token1, minimumDepositToken2);

    ({ fusdcForUsdc: depositFusdc, usdc: depositUsdc } = await pickRatio(
      staking,
      maxFusdc,
      maxUsdc,
      0,
      token0Decimals,
      token1Decimals,
      token2Decimals
    ));

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
    const {
      stakingSigner,
      staking,
      token0,
      token2,
      token0Decimals,
      token1Decimals,
      token2Decimals
    } = args;

    const availableFusdc = await pickRandomBalance(
      token0,
      minimumDepositToken1
    );

    const availableWeth = await pickRandomBalance(
      token2,
      minimumDepositToken2
    );

    const {
      fusdcForWeth: depositFusdc,
      weth: depositWeth
    } = await pickRatio(
      staking,
      availableFusdc,
      0,
      availableWeth,
      token0Decimals,
      token1Decimals,
      token2Decimals
    );

    const [ fusdc, usdc, weth ] = await deposit(
      staking,
      9999999,
      depositFusdc,
      0,
      depositWeth,
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
        staking,
        token0,
        token1,
        token2  ,
        token0Decimals,
        token1Decimals,
        token2Decimals
      } = args;

      await expectDeposited(staking, 0, 0, 0);

      // since we're doing this twice

      const availableFusdc = await pickRandomBalance(token0, minimumDepositToken1);
      const availableUsdc = await pickRandomBalance(token1, minimumDepositToken1);
      const availableWeth = await pickRandomBalance(token2, minimumDepositToken2);

      const {
        fusdcForWeth,
        fusdcForUsdc,
        usdc: depositUsdc,
        weth: depositWeth
      } = await pickRatio(
        staking,
        availableFusdc,
        availableUsdc,
        availableWeth  ,
        token0Decimals,
        token1Decimals,
        token2Decimals
      );

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

      const [ fusdc1, usdc ] = await deposit(
        staking,
        8640000,
        fusdcForUsdc,
        depositUsdc,
        0,
        slippage
      );

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

      for (let i = 1; i <= 10; i++) {
        const path =
          i % 2 == 0
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

  it("should support taking fees from fusdc/usdc sushiswap trades", async () => {
    const {
      stakingSigner,
      stakingSignerAddress,
      token0,
      token1,
      sushiswapToken1Pool,
      sushiswapBentoBox,
      staking,
      token0Decimals,
      token1Decimals,
      token2Decimals
    } = args;

    const availableFusdc = await pickRandomBalance(token0, minimumDepositToken1);
    const availableUsdc = await pickRandomBalance(token1, minimumDepositToken1);

    const {
      fusdcForUsdc: depositFusdc,
      usdc: depositUsdc
    } = await pickRatio(
      staking,
      availableFusdc,
      availableUsdc,
      0,
      token0Decimals,
      token1Decimals,
      token2Decimals
    );

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

    const availableFusdcBento = await pickRandomBalance(token0, minimumDepositToken1);
    const availableUsdcBento = await pickRandomBalance(token1, minimumDepositToken1);

    const bentoDeposit = async (...args: any[]): Promise<BigNumber> => {
      const { shareOut } = await sushiswapBentoBox.callStatic.deposit(...args);
      await sushiswapBentoBox.deposit(...args);
      return shareOut;
    };

    await bentoDeposit(
      token0.address,
      stakingSignerAddress, // from
      stakingSignerAddress, // recipient
      availableFusdcBento,
      0
    );

    await bentoDeposit(
      token1.address,       // token
      stakingSignerAddress, // from
      stakingSignerAddress, // recipient
      availableUsdcBento,
      0
    );

    for (let i = 1; i <= 10; i++) {
      const tokenIn = i % 2 == 0 ? token0 : token1;

      const params = ethers.utils.defaultAbiCoder.encode(
        [ "address", "address", "bool" ], // token in, recipient, should unwrap
        [ tokenIn.address, stakingSignerAddress, false ]
      );

      const shares = await sushiswapBentoBox.balanceOf(
        tokenIn.address,
        stakingSignerAddress
      );

      await sushiswapBentoBox.transfer(
        tokenIn.address, // token
        stakingSignerAddress, // from
        sushiswapToken1Pool.address, // to
        shares // share amount
      );

      const amountOut = await sushiswapToken1Pool.callStatic.swap(params);

      await sushiswapToken1Pool.swap(params);

      expect(amountOut).to.be.gt(0);
    }

    await advanceTime(hre, 8640004);

    await sendEmptyTransaction(stakingSigner);

    const [ fusdcRedeemed, usdcRedeemed ] = await redeem(staking);

    expectWithinSlippage(fusdcRedeemed, fusdcDeposited, 10);

    expectWithinSlippage(usdcRedeemed, usdcDeposited, 10);

    const stakingFusdcAfter = await token0.balanceOf(staking.address);
    const stakingUsdcAfter = await token1.balanceOf(staking.address);

    expect(stakingFusdcAfter).to.be.equal(stakingFusdcBefore);
    expect(stakingUsdcAfter).to.be.equal(stakingUsdcBefore);}
  );

  it("should support taking fees from fusdc/weth sushiswap trades", async () => {
    const {
      stakingSigner,
      stakingSignerAddress,
      token0,
      token2,
      sushiswapToken2Pool,
      sushiswapBentoBox,
      staking,
      token0Decimals,
      token1Decimals,
      token2Decimals
    } = args;

    const availableFusdc = await pickRandomBalance(token0, minimumDepositToken1);
    const availableWeth = await pickRandomBalance(token2, minimumDepositToken2);

    const {
      fusdcForWeth: depositFusdc,
      weth: depositWeth
    } = await pickRatio(
      staking,
      availableFusdc,
      0,
      availableWeth,
      token0Decimals,
      token1Decimals,
      token2Decimals
    );

    const [ fusdcDeposited, usdcDeposited ] = await deposit(
      staking,
      8640000,
      depositFusdc,
      0,
      depositWeth,
      slippage
    );

    // randomly pick which swap to make and just keep going back and
    // forth, swapping the tokens accordingly, to collect fees

    const stakingFusdcBefore = await token0.balanceOf(staking.address);
    const stakingWethBefore = await token2.balanceOf(staking.address);

    const availableFusdcBento = await pickRandomBalance(token0, minimumDepositToken1);
    const availableWethBento = await pickRandomBalance(token2, minimumDepositToken2);

    const bentoDeposit = async (...args: any[]): Promise<BigNumber> => {
      const { shareOut } = await sushiswapBentoBox.callStatic.deposit(...args);
      await sushiswapBentoBox.deposit(...args);
      return shareOut;
    };

    await bentoDeposit(
      token0.address,
      stakingSignerAddress, // from
      stakingSignerAddress, // recipient
      availableFusdcBento,
      0
    );

    await bentoDeposit(
      token2.address,       // token
      stakingSignerAddress, // from
      stakingSignerAddress, // recipient
      availableWethBento,
      0
    );

    for (let i = 1; i <= 10; i++) {
      const tokenIn = i % 2 == 0 ? token0 : token2;

      const params = ethers.utils.defaultAbiCoder.encode(
        [ "address", "address", "bool" ], // token in, recipient, should unwrap
        [ tokenIn.address, stakingSignerAddress, false ]
      );

      const shares = await sushiswapBentoBox.balanceOf(
        tokenIn.address,
        stakingSignerAddress
      );

      await sushiswapBentoBox.transfer(
        tokenIn.address, // token
        stakingSignerAddress, // from
        sushiswapToken2Pool.address, // to
        shares // share amount
      );

      const amountOut = await sushiswapToken2Pool.callStatic.swap(params);

      await sushiswapToken2Pool.swap(params);

      expect(amountOut).to.be.gt(0);
    }

    await advanceTime(hre, 8640004);

    await sendEmptyTransaction(stakingSigner);

    const [ fusdcRedeemed, usdcRedeemed ] = await redeem(staking);

    expectWithinSlippage(fusdcRedeemed, fusdcDeposited, 10);

    expectWithinSlippage(usdcRedeemed, usdcDeposited, 10);

    const stakingFusdcAfter = await token0.balanceOf(staking.address);
    const stakingWethAfter = await token2.balanceOf(staking.address);

    expect(stakingFusdcAfter).to.be.equal(stakingFusdcBefore);
    expect(stakingWethAfter).to.be.gt(stakingWethBefore);
  });
};

export default LootboxTests;
