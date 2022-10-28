import {
    fUsdtAccount,
    fUsdtAccount2,
    fUsdtOracle,
    fUsdtOperator,
    fUsdtCouncil,
    accountAddr,
    configAddr,
} from './setup';
import * as ethers from 'ethers';
import { expect } from "chai";

describe("Token", async function () {
    it("supports disabling wraps and rewards with emergency mode", async function () {
        await fUsdtOperator.enableEmergencyMode();

        await expect(fUsdtAccount.erc20In(1)).to.be.revertedWith("emergency mode!");

        await expect(fUsdtOracle.batchReward([[accountAddr, 1001]], 100, 101))
            .to.be.revertedWith("emergency mode!");

        await expect(fUsdtOperator.unblockReward(accountAddr, 1, true, 100, 101))
            .to.be.revertedWith("emergency mode!");

        await fUsdtOperator.disableEmergencyMode(configAddr);

        await expect(fUsdtAccount.erc20In(1))
            .to.not.be.revertedWith("emergency mode!");
    });

    it("still allows unwrapping during emergency mode", async function () {
        await expect(fUsdtAccount.erc20In(1)).to.not.be.revertedWith("emergency mode!");

        await fUsdtOperator.enableEmergencyMode();

        await expect(fUsdtAccount.erc20Out(1)).to.not.be.revertedWith("emergency mode!");

        await fUsdtOperator.disableEmergencyMode(configAddr);
    });

    it("lets emergency mode be enabled by the three authorities", async function () {
        await fUsdtOperator.enableEmergencyMode();
        await fUsdtOperator.disableEmergencyMode(configAddr);

        await fUsdtOracle.enableEmergencyMode();
        await fUsdtOperator.disableEmergencyMode(configAddr);

        await fUsdtCouncil.enableEmergencyMode();
        await fUsdtOperator.disableEmergencyMode(configAddr);

        await expect(fUsdtAccount.enableEmergencyMode())
            .to.be.revertedWith("can't enable emergency mode!");
    });

    it("only lets the operator disable emergency mode", async function () {
        await fUsdtOperator.enableEmergencyMode();

        for (const user of [fUsdtOracle, fUsdtCouncil, fUsdtAccount]) {
            await expect(user.disableEmergencyMode(configAddr))
                .to.be.revertedWith("only the operator account can use this");
        }

        await fUsdtOperator.disableEmergencyMode(configAddr);
    });

    it("allows small rewards", async function () {
        const initial = await fUsdtAccount.balanceOf(accountAddr);

        await fUsdtOracle.batchReward([[accountAddr, 100]], 100, 101);
        const change = await fUsdtAccount.balanceOf(accountAddr) - initial;
        expect(change).to.equal(100);
    });

    it("prevents absurd rewards", async function () {
        const initial = await fUsdtAccount.balanceOf(accountAddr);

        await fUsdtOracle.batchReward([[accountAddr, 1001]], 100, 101);
        const change = await fUsdtAccount.balanceOf(accountAddr) - initial;
        expect(change).to.equal(0);
    });

    it("allows us to unblock quarantined tokens", async function () {
        const initial = await fUsdtAccount.balanceOf(accountAddr);

        // Because test order dependency is bad practice.
        await fUsdtOracle.batchReward([[accountAddr, 1001]], 100, 101);

        const blockedBalance = (await fUsdtAccount.queryFilter(fUsdtAccount.filters.BlockedReward(accountAddr))).reduce((acc, curr) => {
            const amount = curr.args?.amount ?? 0;
            return acc.add(amount);
        }, ethers.constants.Zero);

        await fUsdtOperator.unblockReward(accountAddr, blockedBalance, true, 100, 101);
        const newChange = await fUsdtAccount.balanceOf(accountAddr) - initial;
        expect(newChange).to.equal(blockedBalance);
    });

    it("prevents minting over user cap", async function () {
        await fUsdtOperator.enableMintLimits(true);

        await fUsdtOracle.updateMintLimits(1000, 100);

        await expect(fUsdtAccount.erc20In(101))
            .to.be.revertedWith("mint amount exceeds user limit!");

        // Cleanup
        await fUsdtOperator.enableMintLimits(false)
    });

    it("prevents minting over global cap", async function () {
        await fUsdtOperator.enableMintLimits(true);
        await fUsdtOracle.updateMintLimits(100, 1000);

        await expect(fUsdtAccount.erc20In(101))
            .to.be.revertedWith("mint amount exceeds global limit!");

        // Cleanup
        await fUsdtOperator.enableMintLimits(false);
    });

    it("tracks global mint limits globally", async function () {
        await fUsdtOperator.enableMintLimits(true);
        await fUsdtOracle.updateMintLimits(1000, 600);

        await expect(fUsdtAccount.erc20In(600))
            .to.not.be.revertedWith("mint amount exceeds global limit!");
        await expect(fUsdtAccount2.erc20In(600))
            .to.be.revertedWith("mint amount exceeds global limit!");
        await expect(fUsdtAccount2.erc20In(400))
            .to.not.be.revertedWith("mint amount exceeds global limit!");

        // Cleanup
        await fUsdtOperator.enableMintLimits(false);
    });
});
