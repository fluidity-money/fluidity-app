import * as hre from "hardhat";
import * as ethers from 'ethers';
import { feiAccount, fFeiAccount } from './setup-mainnet';
import { expectEq, expectGt } from "./test-utils";
import { accountAddr } from "./setup-common";

describe("token aave integration", async function () {
  before(async function () {
    if (process.env.FLU_FORKNET_GOERLI === "true") {
      return this.skip();
    }
  });

  it("should allow depositing erc20 tokens", async function () {
    const originalFeiBalance = (await feiAccount.balanceOf(accountAddr));

    await feiAccount.approve(fFeiAccount.address, 100000);
    await fFeiAccount.erc20In(123);

    // we have 123 fUSDt
    expectEq(await fFeiAccount.balanceOf(accountAddr), 123);

    // there's at least 123 usdt in the fluidity pool
    expectEq(await fFeiAccount.totalSupply(), 123);

    // we've lost 123 USDt
    expectEq(await feiAccount.balanceOf(accountAddr), originalFeiBalance.sub(123));

    // fluidity's invested the fei
    expectEq(await feiAccount.balanceOf(fFeiAccount.address), 0);
  });

  it("should allow withdrawing erc20 tokens", async function () {
    await feiAccount.approve(fFeiAccount.address, 0);
    await feiAccount.approve(fFeiAccount.address, 100000);
    await fFeiAccount.erc20In(123);

    const originalFfeiBalance = await fFeiAccount.balanceOf(accountAddr);
    const originalPoolAmount = await fFeiAccount.totalSupply();

    await fFeiAccount.erc20Out(100);
    expectEq(await fFeiAccount.balanceOf(accountAddr), originalFfeiBalance.sub(100));
    expectEq(await fFeiAccount.totalSupply(), originalPoolAmount.sub(100));
  });

  it("should accrue interest", async function () {
    await feiAccount.approve(fFeiAccount.address, 0);
    await feiAccount.approve(fFeiAccount.address, 10 ** 12);
    // invest 10k fei
    await fFeiAccount.erc20In(10 ** 10);

    // mine a single block to get some interest to prevent weird nondeterminism
    await hre.network.provider.send("evm_mine");
    const initialPoolAmount = await fFeiAccount.callStatic.rewardPoolAmount();

    // aave uses block timestamps
    await hre.network.provider.send("evm_increaseTime", [100 * 15]);
    for (let i = 0; i < 100; i++) {
      await hre.network.provider.send("evm_mine");
    }
    console.log("done mining");
    const finalPoolAmount = await fFeiAccount.callStatic.rewardPoolAmount();
    expectGt(finalPoolAmount, initialPoolAmount);
    console.log(`aave earned ${finalPoolAmount.sub(initialPoolAmount).toString()} interest over 99 blocks`);
  });
});
