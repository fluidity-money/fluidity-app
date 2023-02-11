import * as ethers from 'ethers';
import { signers } from './setup-common';
import { contracts, bindings } from './setup-mainnet';
import { expectEq } from './test-utils';

describe("converting ethereum to fwETH", async function () {
  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
      return this.skip();
    }
  });

  it("should support the user wrapping some ethereum", async function () {
    const { fwEthAccount } = signers;
    const { weth } = contracts;
    const { ethConvertor: ethConvertor_ } = bindings;
    const { operator : ethConvertor } = ethConvertor_;

    const fwEth = weth.deployedToken;

    const existingBalance = await fwEth.balanceOf(fwEthAccount.address);

    expectEq(existingBalance, 0);

    const testNewBalance = ethers.utils.parseEther("0.1");

    await ethConvertor.wrapEth({ value: testNewBalance });

    const newBalance = await fwEth.balanceOf(fwEthAccount.address);

    expectEq(newBalance, testNewBalance);
  });
});
