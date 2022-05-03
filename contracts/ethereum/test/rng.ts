
import { expect } from "chai";
import * as ethers from 'ethers';
import * as hre from 'hardhat';
import type { BigNumber } from "ethers"
import { fusdt_addr, oracle } from "./setup";

describe("token rng", async function () {
  let token: ethers.Contract;
  before(async function () {
    token = await hre.ethers.getContractAt("Token", fusdt_addr, oracle);
  });

  it("should return correct payouts", async function () {
    // 2 balls match
    const inputBalls = [
      "0x01",
      "0x02",
      "0x10",
      "0x11",
      "0x12",
    ]

    const inputPayouts = [
      '0x0248',
      '0x01ea79',
      '0x5077fc',
      '0x044bbd22',
      '0x157ab1ac',
    ];

    const amount: BigNumber = await token.rewardAmount(inputBalls, inputPayouts);
    expect(amount.toHexString()).to.equal(inputPayouts[1]);

    // 3 balls match
    inputBalls[2] = "0x03";

    const amount2: BigNumber = await token.rewardAmount(inputBalls, inputPayouts);
    expect(amount2.toHexString()).to.equal(inputPayouts[2]);
  });
});
