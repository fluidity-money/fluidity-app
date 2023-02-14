import * as hre from "hardhat";
import { configOperator, fFeiAccount, fUsdtAccount } from './setup-mainnet';
import { expect } from "chai";
import { tokenOracleSigner } from "./setup-common";

describe("worker config", async function () {
  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
      return this.skip();
    }
  });

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
