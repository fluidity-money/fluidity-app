import * as ethers from 'ethers';
import { BigNumber } from 'ethers';
import { expect } from "chai";
import { expectEq, expectGt } from './test-utils';
import { bindings, contracts } from './setup-mainnet';
import { signers } from './setup-common';
import { USDT_ADDR } from '../test-constants';

function fluidityReward(...winners: [string, number][]) {
    return [[
        "FLUID",
        winners,
    ]];
}

describe("TokenV1", async function () {
    let fUsdtOperator: ethers.Contract;
    let fUsdtAccount: ethers.Contract;
    let fUsdtOracle: ethers.Contract;
    let fUsdtCouncil: ethers.Contract;
    let fluidToken: string;
    let accountAddr: string;

    before(async function () {
        if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
            return this.skip();
        }

        ({
            usdt: {
                externalOperator: fUsdtOperator,
                fluidAccount1: fUsdtAccount,
                oracleBoundOperator: fUsdtOracle,
                emergencyCouncil: fUsdtCouncil,
            },
        } = bindings);
        accountAddr = await signers.userAccount1.getAddress();
        fluidToken = contracts.usdt.deployedToken.address;
    });

    it("supports disabling wraps and rewards with emergency mode", async function () {
        await fUsdtOperator.enableEmergencyMode();

        await expect(fUsdtAccount.erc20In(1)).to.be.revertedWith("emergency mode!");

        await expect(fUsdtOracle.reward(fluidToken, fluidityReward([accountAddr, 1001]), 100, 101))
            .to.be.revertedWith("emergency mode!");

        await expect(fUsdtOperator.unblockReward(
            "0x394edbc3d36b5dcc6871768b6662c97ab24bf1a1ee48ef38e87a48636e1c2873",
            accountAddr,
            1,
            true,
            100,
            101,
        )).to.be.revertedWith("emergency mode!");

        await fUsdtOperator.disableEmergencyMode();

        await expect(fUsdtAccount.erc20In(1))
            .to.not.be.revertedWith("emergency mode!");
    });

    it("still allows unwrapping during emergency mode", async function () {
        await expect(fUsdtAccount.erc20In(1)).to.not.be.revertedWith("emergency mode!");

        await fUsdtOperator.enableEmergencyMode();

        await expect(fUsdtAccount.erc20Out(1)).to.not.be.revertedWith("emergency mode!");

        await fUsdtOperator.disableEmergencyMode();
    });

    it("lets emergency mode be enabled by the three authorities", async function () {
        await fUsdtOperator.enableEmergencyMode();
        await fUsdtOperator.disableEmergencyMode();

        await fUsdtCouncil.enableEmergencyMode();
        await fUsdtOperator.disableEmergencyMode();

        await expect(fUsdtAccount.enableEmergencyMode())
            .to.be.revertedWith("can't enable emergency mode!");
    });

    it("only lets the operator disable emergency mode", async function () {
        await fUsdtOperator.enableEmergencyMode();

        for (const user of [fUsdtOracle, fUsdtCouncil, fUsdtAccount]) {
            await expect(user.disableEmergencyMode())
                .to.be.revertedWith("operator only");
        }

        await fUsdtOperator.disableEmergencyMode();
    });

    it("allows small rewards", async function () {
        const initial = await fUsdtAccount.balanceOf(accountAddr);

        await fUsdtOracle.reward(fluidToken, fluidityReward([accountAddr, 100]), 100, 101);
        const change = await fUsdtAccount.balanceOf(accountAddr) - initial;
        expect(change).to.equal(100);
    });

    it("underlying token function is working fine", async function () {
        expectEq(await fUsdtAccount.underlyingToken(), USDT_ADDR);
    });

    it("prevents absurd rewards", async function () {
        const initial = await fUsdtAccount.balanceOf(accountAddr);

        await fUsdtOracle.reward(fluidToken, fluidityReward([accountAddr, 1001]), 100, 101);
        const change = await fUsdtAccount.balanceOf(accountAddr) - initial;
        expect(change).to.equal(0);
    });

    it("allows us to unblock quarantined tokens", async function () {
        const initial = await fUsdtAccount.balanceOf(accountAddr);

        // Because test order dependency is bad practice.
        await fUsdtOracle.reward(fluidToken, fluidityReward([accountAddr, 1001]), 100, 101);

        const blockedBalance = (await fUsdtAccount.queryFilter(fUsdtAccount.filters.BlockedReward(accountAddr))).reduce((acc, curr) => {
            const amount = curr.args?.amount ?? 0;
            return acc.add(amount);
        }, ethers.constants.Zero);

        await fUsdtOperator.unblockReward(
            "0x394edbc3d36b5dcc6871768b6662c97ab24bf1a1ee48ef38e87a48636e1c2873",
            accountAddr,
            blockedBalance,
            true,
            100,
            101,
        );
        const newChange = await fUsdtAccount.balanceOf(accountAddr) - initial;
        expect(newChange).to.equal(blockedBalance);
    });

    it("supports taking amounts from the prize pool that isn't anyone's liquidity", async () => {
        const initialAmount = await fUsdtOperator.balanceOf(accountAddr);

        expectGt(initialAmount, 0);

        const initialRewardPool = await fUsdtOperator.callStatic.rewardPoolAmount();

        const drainGangAmount = BigNumber.from(500);

        // reward pool > 500
        expectGt(initialRewardPool, drainGangAmount);

        await fUsdtOperator.drainRewardPool(accountAddr, drainGangAmount);

        const newRewardPool = await fUsdtOperator.callStatic.rewardPoolAmount();

        const newAmount = await fUsdtOperator.balanceOf(accountAddr);

        // expect that the new prize pool is greater than the old amount
        // minus the drain gang amount to compensate for a tick appreciating
        // the value of the prize pool

        expectGt(newRewardPool, initialRewardPool.sub(drainGangAmount));

        expectEq(initialAmount.add(drainGangAmount), newAmount);
    });
});
