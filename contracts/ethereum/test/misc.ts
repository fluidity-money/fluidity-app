
// test small solidity snippets

import * as hre from "hardhat";

import { expect } from "chai";

describe("test misc behaviour", async () => {
  before(function() {
    if (process.env.FLU_FORKNET_NETWORK != "mainnet")
      this.skip();
  });

  it("should have the right amount of items in the weird test loop #1", async () => {
    const factory = await hre.ethers.getContractFactory("TestLoopingBehaviour");
    const contract = await factory.deploy([ 0, 0, 1, 0, 1, 1, 1, 1 ]);
    await contract.test();
    expect(await contract.items()).to.be.equal([0, 0, 0]);
  });
});
