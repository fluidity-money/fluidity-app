import { ethers } from "ethers";
import * as hre from "hardhat";
import { accountSigner, govOperatorSigner, govTokenSigner } from "./setup-common";
import { expectEq } from "./test-utils";

describe("test governance token", async () => {
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
});
