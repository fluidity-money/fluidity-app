
import * as hre from "hardhat";

import { ethers, BigNumber } from "ethers";

import type { BigNumberish } from "ethers";

import { expect, assert } from "chai";

import {
  SUSHISWAP_STABLE_POOL_FACTORY } from "./arbitrum-constants";

export const createPair = async (
  factory: ethers.Contract,
  token0: ethers.Contract,
  token1: ethers.Contract
): Promise<ethers.Contract> => {
  const addr = await factory.callStatic.createPair(token0.address, token1.address);
  await factory.createPair(token0.address, token1.address);
  return hre.ethers.getContractAt("TestUniswapV2Pair", addr);
};

export const expectWithinSlippage = (
  base: BigNumberish,
  test: BigNumberish,
  slippage: BigNumberish
) =>
  assert(
    BigNumber.from(base).sub(BigNumber.from(base)).mul(slippage).div(100).lte(test),
    `${base} - (${base} * ${slippage} / 100) >= ${test} not true!`
  );

export const deposit = async (
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

export const redeem = async (
  contract: ethers.Contract,
): Promise<[ BigNumber, BigNumber, BigNumber ]> => {
  const { fusdcRedeemed, usdcRedeemed, wethRedeemed } =
    await contract.callStatic.redeem(0);

  await contract.redeem(0);

  return [ fusdcRedeemed, usdcRedeemed, wethRedeemed ];
};

export const expectDeposited = async (
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

export const expectRedeemableWithDrift = async (
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

export const deployPool = async (
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
