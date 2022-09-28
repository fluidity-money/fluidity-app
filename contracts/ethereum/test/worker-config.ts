import * as hre from "hardhat";
import * as ethers from 'ethers';
import { tokenOracleSigner, fFeiAccount, fUsdtAccount, configOperator, configCouncil } from './setup';
import { expectEq, expectGt } from "./test-utils";
import { expect } from "chai";

describe("worker config", async function () {
  it("should allow the oracle to be read", async function () {
    expect(await configOperator['getWorkerAddress(address)'](fUsdtAccount.address))
      .to.eq(await tokenOracleSigner.getAddress())

    expect(await fUsdtAccount.oracle())
      .to.eq(await tokenOracleSigner.getAddress())
  });

  it("should allow oracles to be updates", async function() {
    const newOracle = hre.ethers.Wallet.createRandom();

    await configOperator.updateOracles([
      {contractAddr: fUsdtAccount.address, newOracle: newOracle.address}
    ]);

    expect(await configOperator['getWorkerAddress(address)'](fUsdtAccount.address))
      .to.eq(await newOracle.getAddress())
    expect(await fUsdtAccount.oracle())
      .to.eq(await newOracle.getAddress())

    expect(await configOperator['getWorkerAddress(address)'](fFeiAccount.address))
      .to.eq(await tokenOracleSigner.getAddress())

    expect(await fFeiAccount.oracle())
      .to.eq(await tokenOracleSigner.getAddress())

    // cleanup
    await configOperator.updateOracles([
      {contractAddr: fUsdtAccount.address, newOracle: await tokenOracleSigner.getAddress()}
    ]);
  });

  it("supports disabling operation with emergency mode", async function () {
    await configOperator.enableEmergencyMode();

    await expect(configOperator['getWorkerAddress(address)'](fUsdtAccount.address))
      .to.be.revertedWith("emergency mode!")

    await expect(fUsdtAccount.oracle())
      .to.be.revertedWith("emergency mode!")

    await configOperator.disableEmergencyMode();

    expect(await configOperator['getWorkerAddress(address)'](fUsdtAccount.address))
      .to.eq(await tokenOracleSigner.getAddress())

    expect(await fUsdtAccount.oracle())
      .to.eq(await tokenOracleSigner.getAddress())
  });
});
