// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import * as hre from "hardhat";
import { oracle, fusdt_addr, usdt_addr, signer } from './setup';
import * as ethers from 'ethers';
import { expect } from "chai";

describe("Token", async function () {
    let fusdt: ethers.Contract;
    let usdt: ethers.Contract;
    let signerAddress: string;

    before(async () => {
        fusdt = await hre.ethers.getContractAt("Token", fusdt_addr, oracle);
        usdt = await hre.ethers.getContractAt("IERC20", usdt_addr, oracle);

        signerAddress = await signer.getAddress();
    });

    it("Allows small rewards", async function () {
        const initial = await fusdt.balanceOf(signerAddress);

        await fusdt.batchReward([[signerAddress, 100]], 100, 101);
        const change = await fusdt.balanceOf(signerAddress) - initial;
        expect(change).to.equal(100);

    })

    it("Prevents absurd rewards", async function () {
        const initial = await fusdt.balanceOf(signerAddress);

        await fusdt.batchReward([[signerAddress, 1001]], 100, 101);
        const change = await fusdt.balanceOf(signerAddress) - initial;
        expect(change).to.equal(0);
    })

    it("Allows us to unblock quarantined tokens", async function () {
        const initial = await fusdt.balanceOf(signerAddress);

        // Because test order dependency is bad practice.
        await fusdt.batchReward([[signerAddress, 1001]], 100, 101);

        const blockedBalance = (await fusdt.queryFilter(fusdt.filters.BlockedReward(signerAddress))).reduce((acc, curr) => {
            const amount = curr.args?.amount ?? 0;
            return acc.add(amount);
        }, ethers.constants.Zero);

        await fusdt.unblockReward(signerAddress, blockedBalance, true, 100, 101);
        const newChange = await fusdt.balanceOf(signerAddress) - initial;
        expect(newChange).to.equal(blockedBalance);
    })

    it("Prevents minting over user cap", async function () {
        await fusdt.enableMintLimits(true)
        await fusdt.updateMintLimits(1000, 100)
        expect(fusdt.erc20In(101)).to.be.revertedWith("Mint limit exceeded");

        // Cleanup
        await fusdt.enableMintLimits(false)
    })

    it("Prevents minting over global cap", async function () {
        await fusdt.enableMintLimits(true)
        await fusdt.updateMintLimits(100, 1000)
        expect(fusdt.erc20In(101)).to.be.revertedWith("Mint limit exceeded");

        // Cleanup
        await fusdt.enableMintLimits(false)
    })

});