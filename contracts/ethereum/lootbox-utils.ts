
import * as hre from "hardhat";

import { ethers, BigNumber, BigNumberish } from "ethers";

import {
  SUSHISWAP_STABLE_POOL_FACTORY } from "./arbitrum-constants";

import { expect, assert } from "chai";

// MaxDeposit that's enforced by Sushi/Camelot from observation (may not
// be accurate) - this is after adding the minimum balance to this number guesswork
const MaxDeposit = BigNumber.from(10).pow(3);

const Zero = ethers.constants.Zero;

export type pickRatioResults = {
  fusdcForUsdc: BigNumber,
  usdc: BigNumber,
  fusdcForWeth: BigNumber,
  weth: BigNumber
};

export const createPair = async (
  factory: ethers.Contract,
  token0: ethers.Contract,
  token1: ethers.Contract
): Promise<ethers.Contract> => {
  const addr = await factory.callStatic.createPair(token0.address, token1.address);
  await factory.createPair(token0.address, token1.address);
  return hre.ethers.getContractAt("TestCamelotPair", addr);
};

export const expectWithinSlippage = (
  base_: BigNumberish,
  test_: BigNumberish,
  slippage: BigNumberish
) => {
  const base = BigNumber.from(base_);
  const test = BigNumber.from(test_);

  switch (true) {
  case base.eq(0) && test.eq(0): return;
  case base.eq(0): assert(false, `base: ${base} when test: ${test}`);
  case test.eq(0): assert(false, `base ${base} when test: ${test}`);
  default: break;
  }

  const perc = BigNumber.from(slippage);

  const Hundred = BigNumber.from(100);

  assert(
    BigNumber.from(50).sub(Hundred.mul(base).div(base.add(test))).abs().lt(perc),
    `abs(50 - (100 * ${base}) / (${base} + ${test})) < ${perc}`
  );
}

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
  fusdcMin: BigNumberish,
  usdcMin: BigNumberish,
  wethMin: BigNumberish
): Promise<[ BigNumber, BigNumber, BigNumber ]> => {
  const { fusdcRedeemed, usdcRedeemed, wethRedeemed } =
    await contract.callStatic.redeem(0, fusdcMin, usdcMin, wethMin);

  await contract.redeem(0, fusdcMin, usdcMin, wethMin);

  return [ fusdcRedeemed, usdcRedeemed, wethRedeemed ];
};

export const expectDeposited = async (
  contract: ethers.Contract,
  fusdc: BigNumberish,
  usdc: BigNumberish,
  weth: BigNumberish
): Promise<void> => {
  let fusdcDeposited = Zero;
  let usdcDeposited = Zero;
  let wethDeposited = Zero;

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

  return await hre.ethers.getContractAt("TestSushiswapPool", addr);
};

// pickRandomBalance, using the user's balance as the max amount and the
// minimum amount given
export const pickRandomBalance = async (
  token: ethers.Contract,
  minAmount_: BigNumberish
): Promise<BigNumber> => {
  const signerAddr = await token.signer.getAddress();

  const minAmount = BigNumber.from(minAmount_);

  const bal = await token.balanceOf(signerAddr);

  if (bal.lt(minAmount))
    throw new Error(`min amount ${minAmount} > balance ${bal} for signer ${signerAddr}, token ${token.address}!`);

  const decimals = await token.decimals();

  const maxDeposit =
    BigNumber.from(10).pow(decimals).mul(MaxDeposit);

  const maxAmount = bal.gt(maxDeposit) ? maxDeposit : bal;

  if (minAmount.gt(maxAmount))
    throw new Error(`min amount ${minAmount} > max amount ${maxAmount}`);

  if (bal.eq(Zero))
    throw new Error(`balance for ${signerAddr} is 0!`);

  // take a random number where (minAmount < x > bal);

  return ethers.BigNumber.from(ethers.utils.randomBytes(32))
    .mod(maxAmount.sub(minAmount))
    .add(minAmount);
};

export const allocateRatio = (
  num1: BigNumber,
  num2: BigNumber,
  perc1: BigNumber
): [BigNumber, BigNumber] => {
  if (num1.eq(Zero) || num2.eq(Zero)) return [Zero, Zero];
  const oneE40 = BigNumber.from(10).pow(40);
  const perc2 = BigNumber.from(10).pow(12).sub(perc1);
  const [comp1, comp2] = [num1.mul(oneE40).div(perc1), num2.mul(oneE40).div(perc2)];
  const x = comp1.gt(comp2) ? comp2 : comp1;
  const a = perc1.mul(x);
  const b = perc2.mul(x);
  return [a.div(oneE40), b.div(oneE40)];
};

export const pickRatio = async (
  staking: ethers.Contract,
  maxFusdc_: BigNumberish,
  maxUsdc_: BigNumberish,
  maxWeth_: BigNumberish,
  fusdcDecimals_: BigNumberish,
  usdcDecimals_: BigNumberish,
  wethDecimals_: BigNumberish
): Promise<pickRatioResults> => {
  const fusdcDecimals = BigNumber.from(fusdcDecimals_);
  const usdcDecimals = BigNumber.from(usdcDecimals_);
  const wethDecimals = BigNumber.from(wethDecimals_);

  const maxFusdc = BigNumber.from(maxFusdc_);
  const maxUsdc = BigNumber.from(maxUsdc_);
  const maxWeth = BigNumber.from(maxWeth_);

  const { fusdcUsdcRatio, fusdcWethRatio } = await staking.ratios();

  // choose the correct numbers for each side based on the ratio given

  let fusdcUsdcDecimalsAdjustment = ethers.constants.One;
  let fusdcWethDecimalsAdjustment = ethers.constants.One;
  let usdcDecimalsAdjustment = ethers.constants.One;
  let wethDecimalsAdjustment = ethers.constants.One;

  if (fusdcDecimals.gt(usdcDecimals))
    usdcDecimalsAdjustment =
      BigNumber.from(10).pow(fusdcDecimals.sub(usdcDecimals).add(1));

  if (usdcDecimals.gt(fusdcDecimals))
    fusdcUsdcDecimalsAdjustment =
      BigNumber.from(10).pow(usdcDecimals.sub(fusdcDecimals));

  if (fusdcDecimals.gt(wethDecimals))
    wethDecimalsAdjustment =
      BigNumber.from(10).pow(fusdcDecimals.sub(wethDecimals));

  if (wethDecimals.gt(fusdcDecimals))
    fusdcWethDecimalsAdjustment =
      BigNumber.from(10).pow(wethDecimals.sub(fusdcDecimals));

  let [ fusdcForUsdc, usdcForUsdc ] = allocateRatio(
    maxFusdc.mul(fusdcUsdcDecimalsAdjustment),
    maxUsdc.mul(usdcDecimalsAdjustment),
    fusdcUsdcRatio
  );

  fusdcForUsdc = fusdcForUsdc.div(fusdcUsdcDecimalsAdjustment);

  usdcForUsdc = usdcForUsdc.div(usdcDecimalsAdjustment);

  let [ fusdcForWeth, wethForWeth ] = allocateRatio(
    maxFusdc.mul(fusdcWethDecimalsAdjustment),
    maxWeth.mul(wethDecimalsAdjustment),
    fusdcWethRatio
  );

  fusdcForWeth = fusdcForWeth.div(fusdcWethDecimalsAdjustment);

  wethForWeth = wethForWeth.div(wethDecimalsAdjustment);

  return {
    fusdcForUsdc: fusdcForUsdc,
    usdc: usdcForUsdc,
    fusdcForWeth: fusdcForWeth,
    weth: wethForWeth
  };
};
