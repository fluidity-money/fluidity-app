// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import * as hre from "hardhat";
import { signer, usdt_addr, fusdt_addr } from './setup';
import * as ethers from 'ethers';
import { expectEq, expectGt } from './test-utils';

describe("token compound integration", async function () {
  let usdt: ethers.Contract;
  let fusdt: ethers.Contract;
  let signerAddress: string;

  before(async () => {
    usdt = await hre.ethers.getContractAt("IERC20", usdt_addr, signer);
    fusdt = await hre.ethers.getContractAt("Token", fusdt_addr, signer);
    signerAddress = await signer.getAddress();
  });

  it("should allow depositing erc20 tokens", async function () {
    const originalUSDtBalance = await usdt.balanceOf(signerAddress);

    await usdt.approve(fusdt.address, 100000);
    await fusdt.erc20In(123);

    // we have 123 fUSDt
    expectEq(await fusdt.balanceOf(signerAddress), 123);

    // there's at least 123 usdt in the fluidity pool
    expectEq(await fusdt.totalSupply(), 123);

    // we've lost 123 USDt
    expectEq(await usdt.balanceOf(signerAddress), originalUSDtBalance.sub(123));

    // fluidity's invested the USDt
    expectEq(await usdt.balanceOf(fusdt.address), 0);
  });

  it("should allow withdrawing erc20 tokens", async function () {
    await usdt.approve(fusdt.address, 0);
    await usdt.approve(fusdt.address, 100000);
    await fusdt.erc20In(123);

    const originalfUSDtBalance = await fusdt.balanceOf(signerAddress);
    const originalPoolAmount = await fusdt.totalSupply();

    await fusdt.erc20Out(100);
    expectEq(await fusdt.balanceOf(signerAddress), originalfUSDtBalance.sub(100));
    expectEq(await fusdt.totalSupply(), originalPoolAmount.sub(100));
  });

  it("should accrue interest", async function () {
    await usdt.approve(fusdt.address, 0);
    await usdt.approve(fusdt.address, 10 ** 12);
    // invest 10k usdt
    await fusdt.erc20In(10 ** 10);

    const initialPoolAmount = ethers.BigNumber.from(0);
    for (let i = 0; i < 100; i++) {
      await hre.network.provider.send("evm_mine");
    }
    const finalPoolAmount = await fusdt.callStatic.rewardPoolAmount();
    expectGt(finalPoolAmount, initialPoolAmount);
    console.log(`compound earned ${finalPoolAmount.sub(initialPoolAmount).toString()} interest over 100 blocks`);
  });
});
