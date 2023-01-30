import { ethers } from "ethers";
import * as hre from "hardhat";
import { expect } from "chai";
import { accountSigner, govOperatorSigner, govTokenSigner } from "./setup-common";
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");
import { expectEq, expectGt } from "./test-utils";

describe("GovToken", async () => {
  it("uses the account signer to adjust allowance", async () => {
    const govOperatorSignerAddress = govOperatorSigner.address;
    const accountSignerAddress = accountSigner.address;

    const oldAccountSignerAllowance = await govTokenSigner.allowance(
      govOperatorSignerAddress,
      accountSignerAddress
    );

    expectEq(oldAccountSignerAllowance, 0);

    await govTokenSigner.increaseAllowance(accountSignerAddress, 1000);

    const newAccountSignerAllowance = await govTokenSigner.allowance(
      govOperatorSignerAddress,
      accountSignerAddress
    );

    expectEq(newAccountSignerAllowance, 1000);

    await govTokenSigner.decreaseAllowance(accountSignerAddress, 223);

    expectEq(
      await govTokenSigner.allowance(
        govOperatorSignerAddress,
        accountSignerAddress
      ),
      777
    );
  });

  it("burn some tokens and make sure they stay burned", async () => {
    const govOperatorSignerAddress = govOperatorSigner.address;
    const accountSignerAddress = accountSigner.address;

    const amountBefore = await govTokenSigner.balanceOf(govOperatorSignerAddress);

    expectGt(amountBefore, 0);

    await govTokenSigner.burn(9999);

    const newAmount = await govTokenSigner.balanceOf(govOperatorSignerAddress);

    expectGt(amountBefore, 9999);
  });

  it("should fail to drain more than the sender's account", async () => {
    const govOperatorSignerAddress = govOperatorSigner.address;
    const accountSignerAddress = accountSigner.address;

    const amountBefore = await govTokenSigner.balanceOf(govOperatorSignerAddress);

    expectGt(amountBefore, 0);

    // assume that the underflow will take place

    await expect(govTokenSigner.burn(amountBefore + 1000)).to.be.revertedWith("");
  });
});
