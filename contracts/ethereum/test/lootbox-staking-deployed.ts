
/**
 * These tests are only available on Arbitrum forknets!
 *
 * These tests are ran using the currently deployed tokens and
 * contract state on Arbitrum mainnet
 */

import * as hre from "hardhat";

import { ethers } from "ethers";

import { expect } from "chai";

import {
  USUAL_FUSDC_ADDR,
  USDC_ADDR,
  WETH_ADDR,
  USDC_HOLDER,
  CAMELOT_ROUTER,
  CAMELOT_FUSDC_USDC_PAIR,
  CAMELOT_FUSDC_WETH_PAIR,
  SUSHISWAP_FUSDC_USDC_POOL,
  USUAL_LOOTBOX_STAKING,
  SUSHISWAP_FUSDC_WETH_POOL } from "./arbitrum-constants";

import LootboxTests from "./lootbox-tests";

import type { lootboxTestsArgs } from "./lootbox-tests";

const MaxUint256 = ethers.constants.MaxUint256;

describe("LootboxStaking deployed infra", async () => {
  const context = <lootboxTestsArgs>{};

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK != "arbitrum")
      this.skip();

    const stakingSigner = (await hre.ethers.getSigners())[0];

    const stakingSignerAddress = await stakingSigner.getAddress();

    context.stakingSignerAddress = stakingSignerAddress;

    // the context for the tokens here are set later when the signer is set

    const fusdc = await hre.ethers.getContractAt("Token", USUAL_FUSDC_ADDR);

    const usdc = await hre.ethers.getContractAt("BaseNativeToken", USDC_ADDR);

    const weth = await hre.ethers.getContractAt("TestWETH", WETH_ADDR);

    const lootboxStakingBytecode =
      (await hre.artifacts.readArtifact("LootboxStaking")).deployedBytecode;

    const staking = await hre.ethers.getContractAt(
      "LootboxStaking",
      USUAL_LOOTBOX_STAKING
    );

    context.staking = staking;

    await hre.network.provider.request({
      method: "hardhat_setCode",
      params: [
        USUAL_LOOTBOX_STAKING,
        lootboxStakingBytecode
      ]
    });

    context.camelotRouter = await hre.ethers.getContractAt(
      "TestCamelotRouter",
       CAMELOT_ROUTER
    );

    context.camelotToken1Pair = await hre.ethers.getContractAt(
      "TestUniswapV2Pair",
      CAMELOT_FUSDC_USDC_PAIR
    );

    context.camelotToken2Pair = await hre.ethers.getContractAt(
      "TestUniswapV2Pair",
      CAMELOT_FUSDC_WETH_PAIR
    );

    context.sushiswapToken1Pool = await hre.ethers.getContractAt(
      "TestSushiswapStablePool",
      SUSHISWAP_FUSDC_USDC_POOL
    );

    context.sushiswapToken2Pool = await hre.ethers.getContractAt(
      "TestSushiswapStablePool",
      SUSHISWAP_FUSDC_WETH_POOL
    );

    const spendableEth = ethers.constants.WeiPerEther;

    await weth.deposit({ value: spendableEth });

    await weth.connect(stakingSigner).approve(staking.address, MaxUint256);

    expect(await weth.balanceOf(stakingSignerAddress)).to.be.equal(spendableEth);

    // transfer transfer the staking signer as much usdc as we can drain
    // from the designated account

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_HOLDER]
    });

    const usdcSigner = await hre.ethers.getSigner(USDC_HOLDER);

    const usdcSignerAddress = await usdcSigner.getAddress();

    // setting the balance of this account that we're impersonating to
    // the max should be fine

    await hre.network.provider.request({
      method: "hardhat_setBalance",
      params: [
        usdcSignerAddress,
        ethers.constants.MaxUint256.toHexString()
      ]
    });

    // move some funds into fusdc on the stakingSigner and approve
    // everything else

    const usdcSignerBalance = await usdc.balanceOf(usdcSignerAddress);

    await usdc.connect(usdcSigner).transfer(stakingSignerAddress, usdcSignerBalance);

    const spendableUsdc = usdcSignerBalance.div(2);

    await usdc.connect(stakingSigner).approve(staking.address, MaxUint256);

    await fusdc.erc20In(spendableUsdc);

    await fusdc.transfer(stakingSignerAddress, spendableUsdc);

    await fusdc.connect(stakingSigner).approve(staking.address, MaxUint256);

    context.token0 = fusdc.connect(stakingSigner);

    context.token1 = usdc.connect(stakingSigner);

    context.token2 = weth.connect(stakingSigner);

    expect(await fusdc.balanceOf(stakingSignerAddress))
      .to.be.equal(spendableUsdc);
  });

  LootboxTests(context);
});