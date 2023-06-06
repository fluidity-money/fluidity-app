
/**
 * These tests are only available on Arbitrum forknets!
 *
 * These tests are ran using a fresh deployment of tokens and with the
 * Arbitrum-deployed Camelot Router & Pairs, Sushiswap Router & Pairs.
 * A test suite using the currently deployed tokens is available at lootbox-staking-deployed.ts
 */

import * as hre from "hardhat";

import { ethers, BigNumber } from "ethers";

import {
  CAMELOT_FACTORY,
  CAMELOT_ROUTER,
  SUSHISWAP_MASTER_DEPLOYER,
  SUSHISWAP_BENTO_BOX,
  SUSHISWAP_TRIDENT_ROUTER } from "../arbitrum-constants";

import { signers, commonFactories } from "./setup-common";

import {
  createPair,
  deployPool } from "../lootbox-utils";

import LootboxTests from "./lootbox-tests";

import type { lootboxTestsArgs } from "./lootbox-tests";

const MaxUint256 = ethers.constants.MaxUint256;

// 100 of token 1 (6 decimals)
const MinimumDepositToken1 = BigNumber.from(10).pow(8);

// 100 of token 2 (18 decimals)
const MinimumDepositToken2 = BigNumber.from(10).pow(20);

describe("LootboxStaking with fresh deployment of tokens", async () => {
  const context = <lootboxTestsArgs>{};

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK != "arbitrum")
      this.skip();

    const { userAccount1: stakingSigner } = signers;

    context.stakingSigner = stakingSigner;

    const erc20TokenFactory = commonFactories.govToken;

    const stakingFactory = commonFactories.staking;

    const token0 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 0",
      6,
      MaxUint256
    );

    context.token0 = token0;

    context.token0Decimals = await token0.decimals();

    const token1 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 1",
      6,
      MaxUint256
    );

    context.token1 = token1;

    context.token1Decimals = await token1.decimals();

    const token2 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 2",
      18,
      MaxUint256
    );

    context.token2 = token2;

    context.token2Decimals = await token2.decimals();

    const camelotFactory = await hre.ethers.getContractAt(
      "TestUniswapV2Factory",
      CAMELOT_FACTORY
    );

    const camelotRouter = await hre.ethers.getContractAt(
      "TestCamelotRouter",
      CAMELOT_ROUTER
    );

    context.camelotRouter = camelotRouter;

    await token0.approve(camelotRouter.address, MaxUint256);
    await token1.approve(camelotRouter.address, MaxUint256);
    await token2.approve(camelotRouter.address, MaxUint256);

    const camelotToken1Pair = await createPair(camelotFactory, token0, token1);

    context.camelotToken1Pair = camelotToken1Pair;

    const camelotToken1PairAddress = camelotToken1Pair.address;

    const camelotToken2Pair = await createPair(camelotFactory, token0, token2);

    context.camelotToken2Pair = camelotToken2Pair;

    const camelotToken2PairAddress = camelotToken2Pair.address;

    const sushiswapMasterDeployer = await hre.ethers.getContractAt(
      "TestSushiswapMasterDeployer",
      SUSHISWAP_MASTER_DEPLOYER
    );

    const sushiswapTridentRouter = await hre.ethers.getContractAt(
      "TestSushiswapTridentRouter",
      SUSHISWAP_TRIDENT_ROUTER
    );

    context.sushiswapTridentRouter = sushiswapTridentRouter;

    const sushiswapBentoBox = await hre.ethers.getContractAt(
      "TestSushiswapBentoBox",
      SUSHISWAP_BENTO_BOX
    );

    context.sushiswapBentoBox = sushiswapBentoBox;

    await token0.approve(SUSHISWAP_BENTO_BOX, MaxUint256);
    await token1.approve(SUSHISWAP_BENTO_BOX, MaxUint256);
    await token2.approve(SUSHISWAP_BENTO_BOX, MaxUint256);

    const sushiswapToken1Pool = await deployPool(
      sushiswapMasterDeployer,
      token0.address,
      token1.address,
      30 // 0.3%
    );

    context.sushiswapToken1Pool = sushiswapToken1Pool;

    const sushiswapToken2Pool = await deployPool(
      sushiswapMasterDeployer,
      token0.address,
      token2.address,
      30 // 0.3%
    );

    context.sushiswapToken2Pool = sushiswapToken2Pool;

    const sushiswapToken1PoolAddress = sushiswapToken1Pool.address;

    const sushiswapToken2PoolAddress = sushiswapToken2Pool.address;

    await token0.approve(sushiswapToken1PoolAddress, MaxUint256);
    await token1.approve(sushiswapToken1PoolAddress, MaxUint256);
    await token2.approve(sushiswapToken2PoolAddress, MaxUint256);

    const staking = await stakingFactory.connect(stakingSigner).deploy();

    context.staking = staking;

    const stakingSignerAddress = await stakingSigner.getAddress();

    context.stakingSignerAddress = stakingSignerAddress;

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

    await staking.migrateV2();

    await token0.approve(staking.address, MaxUint256);
    await token1.approve(staking.address, MaxUint256);
    await token2.approve(staking.address, MaxUint256);
  });

  LootboxTests(
    context,
    MinimumDepositToken1,
    MinimumDepositToken2
  );
});
