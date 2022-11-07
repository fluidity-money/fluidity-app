import * as hre from "hardhat";
import { usdtAccount, fUsdtAccount } from './setup-mainnet';
import * as ethers from 'ethers';
import { expectEq, expectGt } from './test-utils';
import { accountAddr } from "./setup-common";

describe("token compound integration", async function () {
  before(async function () {
    if (process.env.FLU_FORKNET_GOERLI === "true") {
      return this.skip();
    }
  });

  it("should allow depositing erc20 tokens", async function () {
    const originalUSDtBalance = await usdtAccount.balanceOf(accountAddr);

    await usdtAccount.approve(fUsdtAccount.address, 100000);
    await fUsdtAccount.erc20In(123);

    // we have 123 fUSDt
    expectEq(await fUsdtAccount.balanceOf(accountAddr), 123);

    // there's at least 123 usdt in the fluidity pool
    expectEq(await fUsdtAccount.totalSupply(), 123);

    // we've lost 123 USDt
    expectEq(await usdtAccount.balanceOf(accountAddr), originalUSDtBalance.sub(123));

    // fluidity's invested the USDt
    expectEq(await usdtAccount.balanceOf(fUsdtAccount.address), 0);
  });

  it("should allow withdrawing erc20 tokens", async function () {
    await usdtAccount.approve(fUsdtAccount.address, 0);
    await usdtAccount.approve(fUsdtAccount.address, 100000);
    await fUsdtAccount.erc20In(123);

    const originalfUSDtBalance = await fUsdtAccount.balanceOf(accountAddr);
    const originalPoolAmount = await fUsdtAccount.totalSupply();

    await fUsdtAccount.erc20Out(100);
    expectEq(await fUsdtAccount.balanceOf(accountAddr), originalfUSDtBalance.sub(100));
    expectEq(await fUsdtAccount.totalSupply(), originalPoolAmount.sub(100));
  });

  it("should accrue interest", async function () {
    await usdtAccount.approve(fUsdtAccount.address, 0);
    await usdtAccount.approve(fUsdtAccount.address, 10 ** 12);
    // invest 10k usdt
    await fUsdtAccount.erc20In(10 ** 10);

    const initialPoolAmount = ethers.BigNumber.from(0);
    for (let i = 0; i < 100; i++) {
      await hre.network.provider.send("evm_mine");
    }
    const finalPoolAmount = await fUsdtAccount.callStatic.rewardPoolAmount();
    expectGt(finalPoolAmount, initialPoolAmount);
    console.log(`compound earned ${finalPoolAmount.sub(initialPoolAmount).toString()} interest over 100 blocks`);
  });
});
