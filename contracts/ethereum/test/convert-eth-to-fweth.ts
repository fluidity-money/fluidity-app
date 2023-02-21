import * as ethers from 'ethers';
import { signers } from './setup-common';
import { contracts, bindings } from './setup-mainnet';
import { expectEq } from './test-utils';

describe("converting ethereum to fwETH", async () => {
  let fwEthAccount: ethers.Signer;
  let fwEth: ethers.Contract ;
  let ethConvertor: ethers.Contract;

  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
      return this.skip();
    }

    ({ fwEthAccount } = signers);
    ({ weth : { deployedToken : fwEth } } = contracts);
    ({ ethConvertor : { operator : ethConvertor } } = bindings);
  });

  it("should support the user wrapping some ethereum", async () => {
    const fwEthAccountAddress = await fwEthAccount.getAddress();

    const existingBalance = await fwEth.balanceOf(fwEthAccountAddress);

    const testNewBalance = ethers.utils.parseEther("0.1");

    await ethConvertor.wrapEth({ value: testNewBalance });

    const newBalance = await fwEth.balanceOf(fwEthAccountAddress);

    expectEq(newBalance, existingBalance + testNewBalance);
  });

  it("should support unwrapping some ethereum following wrapping a small amount", async () => {
    const fwEthAccountAddress = await fwEthAccount.getAddress();

    const testNewBalance = ethers.utils.parseEther("0.2");

    const balanceBeforeWrap = await fwEth.balanceOf(fwEthAccountAddress);

    await ethConvertor.wrapEth({ value: testNewBalance });

    console.log(`balance: ${balanceBeforeWrap}`);

    await fwEth.connect(fwEthAccount).approve(ethConvertor.address, testNewBalance);

    const balanceAfterWrap = await fwEth.balanceOf(fwEthAccountAddress);

    expectEq(balanceBeforeWrap.add(testNewBalance), balanceAfterWrap);

    const balanceBeforeUnwrap = await fwEth.balanceOf(fwEthAccountAddress);

    await ethConvertor.unwrapEth(testNewBalance);

    const balanceAfterUnwrap = await fwEth.balanceOf(fwEthAccountAddress);

    expectEq(balanceBeforeUnwrap.sub(testNewBalance), balanceAfterUnwrap);

    expectEq(balanceAfterUnwrap, balanceBeforeWrap);
  });
});
