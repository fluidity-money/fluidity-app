
/**
 * These tests are only available on Arbitrum forknets!
 *
 * These tests are ran using the currently deployed tokens and
 * contract state on Arbitrum mainnet
 */

import * as hre from "hardhat";

import { ethers, BigNumber } from "ethers";

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
  SUSHISWAP_TRIDENT_ROUTER,
  SUSHISWAP_BENTO_BOX,
  SUSHISWAP_FUSDC_WETH_POOL } from "../arbitrum-constants";

import LootboxTests from "./lootbox-tests";

import type { lootboxTestsArgs } from "./lootbox-tests";

const MaxUint256 = ethers.constants.MaxUint256;

describe("LootboxStaking deployed infra", async () => {
  const context = <lootboxTestsArgs>{};

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK != "arbitrum")
      this.skip();

    const stakingSigner = (await hre.ethers.getSigners())[0];

    context.stakingSigner = stakingSigner;

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

    const stakingOperatorAddr = await staking.operator();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [stakingOperatorAddr]
    });

    const stakingOperatorSigner = await hre.ethers.getSigner(stakingOperatorAddr);

    await hre.network.provider.request({
      method: "hardhat_setBalance",
      params: [
        stakingOperatorAddr,
        ethers.constants.MaxUint256.toHexString()
      ]
    });

    try {
      await staking.connect(stakingOperatorSigner).migrateV2();
    } catch (err) {
      console.log(`couldn't migrate deployed staking contract to v2, ${err}`);
    }

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

    const sushiswapToken1Pool = await hre.ethers.getContractAt(
      "TestSushiswapPool",
      SUSHISWAP_FUSDC_USDC_POOL
    );

    context.sushiswapToken1Pool = sushiswapToken1Pool.connect(stakingSigner);

    const sushiswapToken2Pool = await hre.ethers.getContractAt(
      "TestSushiswapPool",
      SUSHISWAP_FUSDC_WETH_POOL
    );

    context.sushiswapToken2Pool = sushiswapToken2Pool.connect(stakingSigner);

    const sushiswapTridentRouter = await hre.ethers.getContractAt(
        "TestSushiswapTridentRouter",
        SUSHISWAP_TRIDENT_ROUTER
    );

    context.sushiswapTridentRouter = sushiswapTridentRouter.connect(stakingSigner);

    const sushiswapBentoBox = await hre.ethers.getContractAt(
        "TestSushiswapBentoBox",
        SUSHISWAP_BENTO_BOX
    );

    context.sushiswapBentoBox = sushiswapBentoBox.connect(stakingSigner);

    await hre.network.provider.request({
      method: "hardhat_setBalance",
      params: [
        stakingSignerAddress,
        MaxUint256.toHexString()
      ]
    });

    const spendableEth = MaxUint256.sub(BigNumber.from(10).pow(30));

    await weth.deposit({ value: spendableEth });

    await weth.transfer(stakingSignerAddress, spendableEth);

    expect(await weth.balanceOf(stakingSignerAddress)).to.be.equal(spendableEth);

    // set the usdc holder's balance to the max uint256

    await hre.network.provider.request({
      method: "hardhat_setStorageAt",
      params: [
        USDC_ADDR, // usdc addr
        // balances slot in arb1 usdc
        "0x2cbeea4754db4a62ba37c8dc51b3b78b45db22693f7bbad15c81ebcb017e1ae2",
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" // max uint256
      ]
    });

    expect(await usdc.balanceOf(USDC_HOLDER)).to.be.equal(MaxUint256);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_HOLDER]
    });

    const usdcSigner = await hre.ethers.getSigner(USDC_HOLDER);

    // transfer the usdc holder's balance to the stakingSigner spender

    await usdc.connect(usdcSigner).transfer(stakingSignerAddress, MaxUint256);

    // move some funds into fusdc on the stakingSigner and approve
    // everything else

    const token0 = fusdc.connect(stakingSigner);

    const token1 = usdc.connect(stakingSigner);

    const token2 = weth.connect(stakingSigner);

    context.token0 = token0;

    context.token0Decimals = await token0.decimals();

    context.token1 = token1;

    context.token1Decimals = await token1.decimals();

    context.token2 = token2;

    context.token2Decimals = await token2.decimals();

    await token0.approve(SUSHISWAP_BENTO_BOX, MaxUint256);

    await token1.approve(SUSHISWAP_BENTO_BOX, MaxUint256);

    await token2.approve(SUSHISWAP_BENTO_BOX, MaxUint256);

    await token0.approve(SUSHISWAP_TRIDENT_ROUTER, MaxUint256);

    await token1.approve(SUSHISWAP_TRIDENT_ROUTER, MaxUint256);

    await token2.approve(SUSHISWAP_TRIDENT_ROUTER, MaxUint256);

    await token0.approve(CAMELOT_ROUTER, MaxUint256);

    await token1.approve(CAMELOT_ROUTER, MaxUint256);

    await token2.approve(CAMELOT_ROUTER, MaxUint256);

    await token2.approve(staking.address, MaxUint256);

    await token1.approve(staking.address, MaxUint256);

    await token1.approve(token0.address, MaxUint256);

    // avoiding the supply cap

    await token0.erc20In(BigNumber.from("1000000000000"));

    await token0.approve(staking.address, MaxUint256);
  });

  LootboxTests(
    context,
    BigNumber.from(1e6),
    ethers.constants.WeiPerEther
  );
});
