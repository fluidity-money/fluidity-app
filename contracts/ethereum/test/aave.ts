// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import * as hre from "hardhat";
import * as ethers from 'ethers';
import { signer, fei_addr, ffei_addr } from './setup';
import { expectEq, expectGt } from "./test-utils";

describe("token aave integration", async function () {
  let fei: ethers.Contract;
  let ffei: ethers.Contract;
  let signerAddress: string;

  before(async function () {
    fei = await hre.ethers.getContractAt("IERC20", fei_addr, signer);
    ffei = await hre.ethers.getContractAt("Token", ffei_addr, signer);
    signerAddress = await signer.getAddress();
  });

  it("should allow depositing erc20 tokens", async function () {
    const originalFeiBalance = (await fei.balanceOf(signerAddress));

    await fei.approve(ffei.address, 100000);
    await ffei.erc20In(123);

    // we have 123 fUSDt
    expectEq(await ffei.balanceOf(signerAddress), 123);

    // there's at least 123 usdt in the fluidity pool
    expectEq(await ffei.totalSupply(), 123);

    // we've lost 123 USDt
    expectEq(await fei.balanceOf(signerAddress), originalFeiBalance.sub(123));

    // fluidity's invested the fei
    expectEq(await fei.balanceOf(ffei.address), 0);
  });

  it("should allow withdrawing erc20 tokens", async function () {
    await fei.approve(ffei.address, 0);
    await fei.approve(ffei.address, 100000);
    await ffei.erc20In(123);

    const originalFfeiBalance = await ffei.balanceOf(signerAddress);
    const originalPoolAmount = await ffei.totalSupply();

    await ffei.erc20Out(100);
    expectEq(await ffei.balanceOf(signerAddress), originalFfeiBalance.sub(100));
    expectEq(await ffei.totalSupply(), originalPoolAmount.sub(100));
  });

  it("should accrue interest", async function () {
    await fei.approve(ffei.address, 0);
    await fei.approve(ffei.address, 10 ** 12);
    // invest 10k fei
    await ffei.erc20In(10 ** 10);

    const initialPoolAmount = await ffei.callStatic.rewardPoolAmount();

    // aave uses block timestamps
    await hre.network.provider.send("evm_increaseTime", [100 * 15]);
    for (let i = 0; i < 100; i++) {
      await hre.network.provider.send("evm_mine");
    }
    const finalPoolAmount = await ffei.callStatic.rewardPoolAmount();
    expectGt(finalPoolAmount, initialPoolAmount);
    console.log(`aave earned ${finalPoolAmount.sub(initialPoolAmount).toString()} interest over 99 blocks`);
  });
});
