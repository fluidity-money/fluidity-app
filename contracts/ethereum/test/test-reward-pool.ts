import * as hre from 'hardhat';
import * as ethers from 'ethers';
import { fUsdtOperator, fDaiAccount, fFeiAccount, rewardPoolsOperator } from './setup-mainnet';
import { assert } from 'chai';

describe("reward pools", async function () {
  it("consistent reward pools", async function () {
    const manualAmount_ =
      [ fUsdtOperator, fDaiAccount, fFeiAccount ]
        .map(v => Promise.all([v.callStatic.rewardPoolAmount(), v.decimals()]));

    let manualAmount = await Promise.all(manualAmount_);

    manualAmount = manualAmount
      .map(([pool, decimals]) => pool / (10 ** decimals))
      .reduce((acc, v) => acc + v);

    // explicitly convert to integers from bignumbers here, hoping that
    // it's consistent in practice, since BigNumber seems to have issues
    // with the number 1e18

    const rewardPoolsAmount = await rewardPoolsOperator.callStatic.getPools().then(pools =>
      pools.reduce((acc, { amount, decimals }) => {
        if (amount.isZero()) return acc;
        else return acc + (amount.toNumber() / (10 ** decimals));
      }, 0)
    );

    assert(
      manualAmount == rewardPoolsAmount,
      `manual amount (${manualAmount}) not the same as reward pools amount ${rewardPoolsAmount}`
    );
  });
});
