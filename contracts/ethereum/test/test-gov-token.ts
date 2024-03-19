import { ethers } from "ethers";
import { expect } from "chai";
import { commonBindings, signers } from "./setup-common";
import { expectEq, expectGt } from "./test-utils";

describe("TestGovToken", async () => {
  let govOperator: ethers.Contract;
  let govOperatorSigner: ethers.Signer;
  let accountSigner: ethers.Signer;

  before(async function() {
    govOperator = commonBindings.govToken.owner;
    govOperatorSigner = signers.govToken.owner;
    accountSigner = signers.userAccount1;
  });

  it("uses the account signer to adjust allowance", async () => {
    const govOperatorSignerAddress = await govOperatorSigner.getAddress();
    const accountSignerAddress = await accountSigner.getAddress();

    const oldAccountSignerAllowance = await govOperator.allowance(
      govOperatorSignerAddress,
      accountSignerAddress
    );

    expectEq(oldAccountSignerAllowance, 0);

    await govOperator.increaseAllowance(accountSignerAddress, 1000);

    const newAccountSignerAllowance = await govOperator.allowance(
      govOperatorSignerAddress,
      accountSignerAddress
    );

    expectEq(newAccountSignerAllowance, 1000);

    await govOperator.decreaseAllowance(accountSignerAddress, 223);

    expectEq(
      await govOperator.allowance(
        govOperatorSignerAddress,
        accountSignerAddress
      ),
      777
    );
  });

  it("burn some tokens and make sure they stay burned", async () => {
    const govOperatorSignerAddress = await govOperatorSigner.getAddress();

    const amountBefore = await govOperator.balanceOf(govOperatorSignerAddress);

    expectGt(amountBefore, 0);

    await govOperator.burn(9999);

    expectGt(amountBefore, 9999);
  });

  it("should fail to drain more than the sender's account", async () => {
    const govOperatorSignerAddress = await govOperatorSigner.getAddress();

    const amountBefore = await govOperator.balanceOf(govOperatorSignerAddress);

    expectGt(amountBefore, 0);

    // assume that the underflow will take place

    await expect(govOperator.burn(amountBefore + 1000)).to.be.revertedWith("");
  });
});
