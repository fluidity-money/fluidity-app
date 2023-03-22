import * as hre from "hardhat";
import { expect } from "chai";
import { ethers } from "ethers";
import { bindings } from "./setup-mainnet";
import { signers } from "./setup-common";

describe("worker config", async function () {
  let operatorOperator: ethers.Contract;
  let tokenOracleSigner: ethers.Signer;
  let fUsdtAccount: ethers.Contract;
  let fFeiAccount: ethers.Contract;

  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet")
      return this.skip();

    ({
      usdt: { fluidAccount1: fUsdtAccount },
      fei: { fluid: fFeiAccount },
      operator: { externalOperator: operatorOperator },
    } = bindings);
    tokenOracleSigner = signers.token.externalOracle;
  });

  it("should allow the oracle to be read", async function () {
    expect(await operatorOperator['getWorkerAddress(address)'](fUsdtAccount.address))
      .to.eq(await tokenOracleSigner.getAddress())
  });

  it("should allow oracles to be updated", async function() {
    const newOracle = hre.ethers.Wallet.createRandom();

    await operatorOperator.updateOracles([
      {contractAddr: fUsdtAccount.address, newOracle: newOracle.address}
    ]);

    expect(await operatorOperator['getWorkerAddress(address)'](fUsdtAccount.address))
      .to.eq(await newOracle.getAddress())

    expect(await operatorOperator['getWorkerAddress(address)'](fFeiAccount.address))
      .to.eq(await tokenOracleSigner.getAddress())

    // cleanup
    await operatorOperator.updateOracles([
      {contractAddr: fUsdtAccount.address, newOracle: await tokenOracleSigner.getAddress()}
    ]);
  });

  it("supports disabling operation with emergency mode", async function () {
    await operatorOperator.enableEmergencyMode();

    await expect(operatorOperator['getWorkerAddress(address)'](fUsdtAccount.address))
      .to.be.revertedWith("emergency mode!")

    await operatorOperator.disableEmergencyMode();

    expect(await operatorOperator['getWorkerAddress(address)'](fUsdtAccount.address))
      .to.eq(await tokenOracleSigner.getAddress())
  });
});
