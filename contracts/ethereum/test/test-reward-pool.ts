import * as ethers from 'ethers';
import { assert } from 'chai';
import { bindings } from './setup-mainnet';
import { BigNumber } from 'ethers';

describe("registry reward pools", async function () {
  let registryOperator: ethers.Contract;

  let tokens: ethers.Contract[];

  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
      return this.skip();
    }

    tokens = [
      bindings.usdt.fluidAccount1,
      bindings.dai.fluid,
      bindings.fei.fluid,
      bindings.weth.fluid
    ];

    ({
      registry: { externalOperator: registryOperator },
    } = bindings);
  });

  it("registry consistent reward pools", async function () {
    const manualAmounts_ = tokens.map(v =>
      Promise.all([v.callStatic.rewardPoolAmount(), v.decimals()]) as Promise<[number, number]>);

    const manualAmounts = await Promise.all(manualAmounts_);

    const manualAmount_ = manualAmounts
      .map(([pool, decimals]) => pool / (10 ** decimals))
      .reduce((acc, v) => acc + v);

    const manualAmount = BigNumber.from(manualAmount_);

    const rewardPoolsAmount_ =
      await registryOperator.callStatic.getRewardPools();

    const rewardPoolsAmount = BigNumber.from(rewardPoolsAmount_ / 1e18);

    const similar =
      manualAmount.add(1).gt(rewardPoolsAmount) ||
      manualAmount.lt(rewardPoolsAmount.add(1));

    assert(
      similar,
      `manual amount (${manualAmount}) not similar as reward pools amount ${rewardPoolsAmount}`
    );
  });
});
