
import * as hre from "hardhat";

import { ethers, BigNumber, BigNumberish } from "ethers";

import {
  SUSHISWAP_STABLE_POOL_FACTORY } from "./arbitrum-constants";

import { expect, assert } from "chai";

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
  let fusdcDeposited = ethers.constants.Zero;
  let usdcDeposited = ethers.constants.Zero;
  let wethDeposited = ethers.constants.Zero;

  const deposits = await contract.deposits(contract.signer.getAddress());

  for (const deposit of deposits) {
    const {
      camelotTokenA,
      camelotTokenB,
      sushiswapTokenA,
      sushiswapTokenB,
      fusdcUsdcPair
    } = deposit;

    fusdcDeposited = fusdcDeposited.add(camelotTokenA.add(sushiswapTokenA));

    if (fusdcUsdcPair)
      usdcDeposited = usdcDeposited.add(camelotTokenB.add(sushiswapTokenB));
    else
      wethDeposited = wethDeposited.add(camelotTokenB.add(sushiswapTokenB));
  }

  expect(fusdcDeposited, "deposited fusdc").to.be.equal(fusdc);
  expect(usdcDeposited, "deposited usdc").to.be.equal(usdc);
  expect(wethDeposited, "deposited weth").to.be.equal(weth);
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

export const pickRandomBalance = async (
  token: ethers.Contract,
  minimumAmount: BigNumberish
): Promise<BigNumber> => {
  const signerAddr = await token.signer.getAddress();
  const bal = await token.balanceOf(signerAddr);

  if (bal.lt(minimumAmount))
    throw new Error(`minimum amount ${minimumAmount} > balance ${bal}!`);

  if (bal.eq(ethers.constants.Zero))
    throw new Error(`balance for ${signerAddr} is 0!`);

  // take a random number where (minimumAmount < x > bal)

  return ethers.BigNumber.from(ethers.utils.randomBytes(32))
    .mod(bal.add(minimumAmount))
    .sub(minimumAmount);
};