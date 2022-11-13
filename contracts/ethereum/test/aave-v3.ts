import * as hre from "hardhat";
import { expectEq, expectGt } from "./test-utils";
import { fAUsdcAccount, usdcAccount } from "./setup-goerli";
import { accountAddr } from "./setup-common";


describe("token aave v3 integration", async function () {
  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "goerli") {
      return this.skip();
    }
  });

  it("should allow depositing erc20 tokens", async function () {
    const originalDaiBalance = (await usdcAccount.balanceOf(accountAddr));

    await usdcAccount.approve(fAUsdcAccount.address, 100000);
    await fAUsdcAccount.erc20In(123);

    // we have 123 fDAI
    expectEq(await fAUsdcAccount.balanceOf(accountAddr), 123);

    // there's at least 123 usdt in the fluidity pool
    expectEq(await fAUsdcAccount.totalSupply(), 123);

    // we've lost 123 USDt
    expectEq(await usdcAccount.balanceOf(accountAddr), originalDaiBalance.sub(123));

    // fluidity's invested the dai
    expectEq(await usdcAccount.balanceOf(fAUsdcAccount.address), 0);
  });

  it("should allow withdrawing erc20 tokens", async function () {
    await usdcAccount.approve(fAUsdcAccount.address, 0);
    await usdcAccount.approve(fAUsdcAccount.address, 100000);
    await fAUsdcAccount.erc20In(123);

    const originalFdaiBalance = await fAUsdcAccount.balanceOf(accountAddr);
    const originalPoolAmount = await fAUsdcAccount.totalSupply();

    await fAUsdcAccount.erc20Out(100);
    expectEq(await fAUsdcAccount.balanceOf(accountAddr), originalFdaiBalance.sub(100));
    expectEq(await fAUsdcAccount.totalSupply(), originalPoolAmount.sub(100));
  });

  it("should accrue interest", async function () {
    await usdcAccount.approve(fAUsdcAccount.address, 0);
    await usdcAccount.approve(fAUsdcAccount.address, 10 ** 12);
    // invest 10k dai
    await fAUsdcAccount.erc20In(10 ** 10);

    // mine a single block to get some interest to prevent weird nondeterminism
    await hre.network.provider.send("evm_mine");
    const initialPoolAmount = await fAUsdcAccount.callStatic.rewardPoolAmount();

    // aave uses block timestamps
    await hre.network.provider.send("evm_increaseTime", [100 * 15]);
    for (let i = 0; i < 100; i++) {
      await hre.network.provider.send("evm_mine");
    }
    console.log("done mining");
    const finalPoolAmount = await fAUsdcAccount.callStatic.rewardPoolAmount();
    expectGt(finalPoolAmount, initialPoolAmount);
    console.log(`aave v3 earned ${finalPoolAmount.sub(initialPoolAmount).toString()} interest over 99 blocks`);
  });
});
