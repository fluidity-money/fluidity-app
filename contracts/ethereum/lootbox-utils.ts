
import * as hre from "hardhat";

import { ethers, BigNumber, BigNumberish } from "ethers";

import {
  SUSHISWAP_STABLE_POOL_FACTORY } from "./arbitrum-constants";

import { expect, assert } from "chai";

const MaxDeposit = BigNumber.from(200000000);

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
    await contract.deposit(
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

  return await hre.ethers.getContractAt(
    "TestSushiswapStablePool",
    addr
  );
};

// pickRandomBalance, using the user's balance as the max amount and the
// minimum amount given
export const pickRandomBalance = async (
  token: ethers.Contract,
  minimumAmount: BigNumberish
): Promise<BigNumber> => {
  const signerAddr = await token.signer.getAddress();
  const bal = await token.balanceOf(signerAddr);

  if (bal.lt(minimumAmount))
    throw new Error(`minimum amount ${minimumAmount} > balance ${bal}!`);

  if (bal.eq(Zero))
    throw new Error(`balance for ${signerAddr} is 0!`);

  const decimals = await token.decimals();

  const maxDeposit = MaxDeposit.mul(decimals);

  let maxAmount = bal.gt(maxDeposit) ? maxDeposit : bal;

  maxAmount = maxAmount.add(minimumAmount);

  console.log(`max amount: ${maxAmount}, max deposit: ${maxDeposit}, bal: ${bal}`);

  // take a random number where (minimumAmount < x > bal)

  return ethers.BigNumber.from(ethers.utils.randomBytes(32))
    .mod(maxAmount)
    .sub(minimumAmount);
};

export const pickRatio = async (
  staking: ethers.Contract,
  maxFusdc_: BigNumberish,
  maxUsdc_: BigNumberish,
  maxWeth_: BigNumberish
): Promise<pickRatioResults> => {
  const {
    fusdcUsdcRatio: fusdcUsdcRatio_,
    fusdcWethRatio: fusdcWethRatio_
  } = await staking.ratios();

  const maxFusdc = BigNumber.from(maxFusdc_);
  const maxUsdc = BigNumber.from(maxUsdc_);
  const maxWeth = BigNumber.from(maxWeth_);

  // since we use 1e6 instead of 1e10 to get the division of both sides,
  // we need to multiply everything by 1000

  const oneE6 = BigNumber.from(10).pow(6);

  console.log(`fusdc weth ratio: ${fusdcWethRatio_}`);

  const fusdcUsdcRatio = fusdcUsdcRatio_.div(oneE6);

  const fusdcWethRatio = fusdcWethRatio_.div(oneE6);

  console.log(`fusdc weth ratio after: ${fusdcWethRatio}`);

  const pickRatio = (
    num1: BigNumber,
    num2: BigNumber,
    perc1: BigNumber,
    perc2: BigNumber
  ): [BigNumber, BigNumber] => {
    if (num1.eq(Zero) || num2.eq(Zero)) return [Zero, Zero];
    const [comp1, comp2] = [num1.div(perc1), num2.div(perc2)];
    const x = comp1.gt(comp2) ? comp2 : comp1;
    const a = perc1.mul(x);
    const b = perc2.mul(x);
    return [a, b];
};

  const [ fusdcForUsdc, usdcForUsdc ] = pickRatio(
    maxFusdc,
    maxUsdc,
    fusdcUsdcRatio,
    oneE6.sub(fusdcUsdcRatio)
  );

  const [ fusdcForWeth_, wethForWeth ] = pickRatio(
    maxFusdc.mul(BigNumber.from(1e10)),
    maxWeth,
    fusdcWethRatio,
    oneE6.sub(fusdcWethRatio)
  );

  const fusdcForWeth = fusdcForWeth_.div(BigNumber.from(1e10));

  console.log(`fusdcWethRatio: ${fusdcWethRatio}, fusdc for weth: ${fusdcForWeth}, weth for weth: ${wethForWeth}`);

  return {
    fusdcForUsdc: fusdcForUsdc,
    usdc: usdcForUsdc,
    fusdcForWeth: fusdcForWeth,
    weth: wethForWeth
  };
};
