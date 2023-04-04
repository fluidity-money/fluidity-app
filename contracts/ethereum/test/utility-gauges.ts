import { BigNumber, BigNumberish, constants, ethers } from "ethers";
import { expect } from "chai";
import * as hre from 'hardhat';
import { commonBindings, commonFactories, signers } from "./setup-common";
import { expectEq, expectGt } from "./test-utils";
import { deployGovToken, deployUtilityGauges, deployVEGovLockup } from "../deployment";

describe("Utility gauges", async () => {
  let veGovLockupFactory: ethers.ContractFactory;
  let govTokenFactory: ethers.ContractFactory;
  let utilityGaugesFactory: ethers.ContractFactory;

  let veGovTokenSigner: ethers.Signer;

  let account1Signer: ethers.Signer;
  let account2Signer: ethers.Signer;

  let govToken: ethers.Contract;
  let veGovLockup: ethers.Contract;
  let utilityGauges: ethers.Contract;

  let utilityGaugesUser1: ethers.Contract;
  let utilityGaugesUser2: ethers.Contract;

  let utility1Details: [string, string];
  let utility2Details: [string, string];

  let depositAmount1: BigNumberish;
  let depositAmount2: BigNumberish;

  before(async function() {
    ({
      veGovLockup: veGovLockupFactory,
      govToken: govTokenFactory,
      utilityGauges: utilityGaugesFactory,
    } = commonFactories);

    ({
      govToken: {
        owner: veGovTokenSigner,
      },
      userAccount1: account1Signer,
      userAccount2: account2Signer,
    } = signers);

    govToken = await deployGovToken(
      govTokenFactory,
      veGovTokenSigner,
      "should wrap",
      "test",
      18,
      1000
    );

    await govToken.transfer(await account1Signer.getAddress(), 500);
    await govToken.transfer(await account2Signer.getAddress(), 500);

    veGovLockup = await deployVEGovLockup(
      veGovLockupFactory,
      veGovTokenSigner,
      govToken.address
    );

    // 300 days
    await govToken.connect(account1Signer).approve(veGovLockup.address, constants.MaxUint256);
    await veGovLockup.connect(account1Signer).createLock(500, 60 * 60 * 24 * 300);

    await govToken.connect(account2Signer).approve(veGovLockup.address, constants.MaxUint256);
    await veGovLockup.connect(account2Signer).createLock(500, 60 * 60 * 24 * 300);

    // deploy this on account1 since it's a custom deployment for this test
    utilityGauges = await deployUtilityGauges(
      utilityGaugesFactory,
      account1Signer,
      account1Signer,
      veGovLockup.address,
    );

    utility1Details = [govToken.address, "testUtility1"];
    utility2Details = [govToken.address, "testUtility2"];

    await utilityGauges.addUtility(...utility1Details);
    await utilityGauges.addUtility(...utility2Details);

    utilityGaugesUser1 = utilityGauges.connect(account1Signer);
    utilityGaugesUser2 = utilityGauges.connect(account2Signer);

  });

  it("allows voting", async () => {
    const user1Balance: BigNumber = await utilityGaugesUser1.callStatic['votesAvailable()']();
    const user2Balance: BigNumber = await utilityGaugesUser2.callStatic['votesAvailable()']();

    expectGt(user1Balance, 500);
    expectGt(user2Balance, 500);

    depositAmount1 = user1Balance.div(2);
    depositAmount2 = user1Balance.div(3);
    const totalDepositAmount = depositAmount1.add(depositAmount2);

    await utilityGaugesUser1.vote(...utility1Details, depositAmount1);
    await utilityGaugesUser2.vote(...utility2Details, depositAmount2);

    const [util1, total1] = await utilityGaugesUser1.callStatic.getWeight(...utility1Details);
    const [util2, total2] = await utilityGaugesUser1.callStatic.getWeight(...utility2Details);

    expectEq(util1, depositAmount1);
    expectEq(total1, totalDepositAmount);

    expectEq(util2, depositAmount2);
    expectEq(total2, totalDepositAmount);
  });

  it("resets after a week", async () => {
    await hre.network.provider.send(
      "evm_increaseTime",
      [60 * 60 * 24 * 8], // 8 days
    );
    // need to mine a block to get the update to go through
    await hre.network.provider.send("evm_mine", []);

    const [util1, total1] = await utilityGaugesUser1.callStatic.getWeight(...utility1Details);
    expectEq(util1, 0);
    expectEq(total1, 0);

    const user1Balance: BigNumber = await utilityGaugesUser1.callStatic['votesAvailable()']();
    expectGt(user1Balance, depositAmount1);
  });

  it("doesn't allow voting on a utility that doesn't exist", async () => {
    await expect(utilityGaugesUser1.vote(utility1Details[0], "not a utility", 1))
      .to.be.revertedWith("utility gauge doesn't exist");
  });
  it("doesn't allow voting more than a user's balance", async () => {
    const user1Balance: BigNumber = await utilityGaugesUser1.callStatic['votesAvailable()']();

    await expect(utilityGaugesUser1.vote(...utility1Details, user1Balance.add(1)))
      .to.be.revertedWith("not enough votes");
  });
});
