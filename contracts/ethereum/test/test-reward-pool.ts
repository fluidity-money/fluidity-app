import * as hre from 'hardhat';
import * as ethers from 'ethers';
import { fUsdtOperator, fDaiAccount, fFeiAccount, rewardPoolsOperator, fUsdtAccount } from './setup-mainnet';
import { assert } from 'chai';

describe("reward pools", async function () {
  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
      return this.skip();
    }
  });

  it("consistent reward pools", async function () {
    const manualAmount_ = [ fUsdtOperator, fDaiAccount, fFeiAccount ]
      .map(v => Promise.all([v.callStatic.rewardPoolAmount(), v.decimals()]) as Promise<[number, number]>);

    let manualAmounts = await Promise.all(manualAmount_);

    let manualAmount = manualAmounts
      .map(([pool, decimals]) => pool / (10 ** decimals))
      .reduce((acc, v) => acc + v);

    // explicitly convert to integers from bignumbers here, hoping that
    // it's consistent in practice, since BigNumber seems to have issues
    // with the number 1e18

    const pools: { amount: ethers.BigNumber, decimals: number}[]
      = await rewardPoolsOperator.callStatic.getPools();

    let rewardPoolsAmount = pools.reduce(
      (acc, { amount, decimals }) => acc + (amount.toNumber() / (10 ** decimals)),
      0,
    );

    assert(
      manualAmount == rewardPoolsAmount,
      `manual amount (${manualAmount}) not the same as reward pools amount ${rewardPoolsAmount}`
    );
  });
});
