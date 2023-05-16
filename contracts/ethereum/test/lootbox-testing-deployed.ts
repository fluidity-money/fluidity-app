
// these tests are only available on arbitrum

import * as hre from "hardhat";

import { ethers, BigNumber } from "ethers";

import { expect } from "chai";

import {
  USUAL_FUSDC_ADDR,
  USDC_ADDR,
  WETH_ADDR,
  USDC_HOLDER,
  CAMELOT_ROUTER,
  SUSHISWAP_BENTO_BOX,
  CAMELOT_FUSDC_USDC_PAIR,
  CAMELOT_FUSDC_WETH_PAIR,
  SUSHISWAP_FUSDC_USDC_POOL,
  SUSHISWAP_FUSDC_WETH_POOL } from "./arbitrum-constants";

import { deposit } from "./lootbox";

const slippage = 3;

describe("LootboxStaking deployed infra", async () => {
  let staking: ethers.Contract;

  let fusdc: ethers.Contract;
  let usdc: ethers.Contract;
  let weth: ethers.Contract;

  let stakingSignerAddress: string;

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK != "arbitrum")
      this.skip();

    const stakingSigner = (await hre.ethers.getSigners())[0];

    stakingSignerAddress = await stakingSigner.getAddress();

    const stakingFactory =
      (await hre.ethers.getContractFactory("LootboxStaking"))
        .connect(stakingSigner);

    staking = await stakingFactory.connect(stakingSigner).deploy();

    await staking.init(
      stakingSignerAddress, // operator
      stakingSignerAddress, // emergency council
      USUAL_FUSDC_ADDR,
      USDC_ADDR,
      WETH_ADDR,
      CAMELOT_ROUTER,
      SUSHISWAP_BENTO_BOX,
      CAMELOT_FUSDC_USDC_PAIR,
      CAMELOT_FUSDC_WETH_PAIR,
      SUSHISWAP_FUSDC_USDC_POOL,
      SUSHISWAP_FUSDC_WETH_POOL
    );

    fusdc = await hre.ethers.getContractAt("Token", USUAL_FUSDC_ADDR);

    usdc = await hre.ethers.getContractAt("BaseNativeToken", USDC_ADDR);

    weth = await hre.ethers.getContractAt("TestWETH", WETH_ADDR);

    const spendableEth = ethers.constants.WeiPerEther;

    await weth.deposit({ value: spendableEth });

    await weth.approve(staking.address, spendableEth);

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

    await usdc.approve(fusdc.address, spendableUsdc);

    await usdc.approve(staking.address, spendableUsdc);

    await fusdc.erc20In(spendableUsdc);

    await fusdc.approve(staking.address, spendableUsdc);

    expect(await fusdc.balanceOf(stakingSignerAddress))
      .to.be.equal(spendableUsdc);
  });

  it("should deposit 1e6 fusdc, 1e6 usdc and 0 eth", async () => {
    const depositAmount = BigNumber.from(10).pow(6);

    const fusdcBeforeDeposit = fusdc.balanceOf(stakingSignerAddress);
    const usdcBeforeDeposit = usdc.balanceOf(stakingSignerAddress);
    const wethBeforeDeposit = weth.balanceOf(stakingSignerAddress);

    const [ depositFusdc, depositUsdc, depositWeth ] = await deposit(
      staking,
      2764800,
      depositAmount,
      depositAmount,
      0,
      slippage
    );

    expect(await fusdc.balanceOf(stakingSignerAddress))
      .to.be.equal(fusdcBeforeDeposit.sub(depositFusdc));

    expect(await usdc.balanceOf(stakingSignerAddress))
      .to.be.equal(usdcBeforeDeposit.sub(depositUsdc));

    expect(await weth.balanceOf(stakingSignerAddress))
      .to.be.equal(wethBeforeDeposit.sub(depositWeth));

    const fusdcBeforeRedeem = await fusdc.balanceOf(stakingSignerAddress);
    const usdcBeforeRedeem = await usdc.balanceOf(stakingSignerAddress);
    const wethBeforeRedeem = await weth.balanceOf(stakingSignerAddress);
  });
});
