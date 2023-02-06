import * as hre from 'hardhat';
import * as ethers from 'ethers';
import { accountSigner } from './setup-common';
import { wEthAddr, fwEthAccount, fwEthAddr } from './setup-mainnet';
import { WETH_ADDR, USUAL_FETH_ADDR } from '../test-constants';
import { expectEq } from './test-utils';

describe("converting ethereum to fwETH", async function () {
  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
      return this.skip();
    }
  });

  it("should support the user wrapping some ethereum", async function () {
    const convertorFactory = await hre.ethers.getContractFactory(
      "ConvertorEthToToken"
    );

    const convertor = await convertorFactory.connect(accountSigner).deploy(
      fwEthAddr,
      wEthAddr
    );

    const existingBalance = await fwEthAccount.balanceOf(accountSigner.address);

    expectEq(existingBalance, 0);

    const testNewBalance = ethers.utils.parseEther("0.1");

    await convertor.wrapEth({ value: testNewBalance });

    const newBalance = await fwEthAccount.balanceOf(accountSigner.address);

    expectEq(newBalance, testNewBalance);
  });
});
