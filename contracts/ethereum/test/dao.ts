
import * as hre from 'hardhat';

import { expect } from 'chai';

import type { ethers } from 'ethers';

import {
  commonContracts,
  commonBindings,
  signers } from './setup-common';

import { deployBeacons } from '../deployment';

import { expectGt, expectEq } from "./test-utils";

import {
  advanceTimePastProposalFinished,
  advanceTimeToFrozen,
  PROPOSAL_STATE_UNFINISHED,
  PROPOSAL_STATE_FROZEN,
  PROPOSAL_STATE_SUCCEEDED,
  PROPOSAL_STATE_FAILED } from '../dao';

const GOV_TO_LOCK = 1000;

describe("DAOV1", async () => {
  let govToken: ethers.Contract;

  let govTokenSigner1: ethers.Signer;
  let govTokenSigner2: ethers.Signer;
  let govTokenSigner3: ethers.Signer;

  let dao: ethers.Contract;

  let veGovLockup: ethers.Contract;

  let testDAOUpdates: ethers.Contract;

  let testDAOUpgradeableV2Impl: ethers.Contract;

  let testDAOUpgradeableV1Factory: ethers.ContractFactory;
  let testDAOUpgradeableV2Factory: ethers.ContractFactory;

  let testDAOUpgradeableBeacon: ethers.Contract;

  let testDAOUpgradeableBeaconProxy: ethers.Contract;

  let govTokenSigner1Address: string;
  let govTokenSigner2Address: string;
  let govTokenSigner3Address: string;

  before(async () => {
    govToken = commonBindings.govToken.owner;

    ({
      owner: govTokenSigner1,
      extraSigner1: govTokenSigner2,
      extraSigner2: govTokenSigner3
    } = signers.govToken);

    veGovLockup = commonContracts.veGovLockup.connect(govTokenSigner1);
    dao = commonContracts.dao.connect(govTokenSigner1);

    const testDAOUpdatesFactory = await hre.ethers.getContractFactory(
      "TestDAOUpdates"
    );

    govTokenSigner1Address = await govTokenSigner1.getAddress();
    govTokenSigner2Address = await govTokenSigner2.getAddress();
    govTokenSigner3Address = await govTokenSigner3.getAddress();

    testDAOUpdates = await testDAOUpdatesFactory.deploy(dao.address);

    testDAOUpgradeableV1Factory = await hre.ethers.getContractFactory(
      "TestDAOUpgradeableV1"
    );

    testDAOUpgradeableV2Factory = await hre.ethers.getContractFactory(
      "TestDAOUpgradeableV2"
    );

    testDAOUpgradeableV2Impl = await testDAOUpgradeableV2Factory.deploy();

    [ testDAOUpgradeableBeacon ] = await deployBeacons(
      hre,
      testDAOUpgradeableV1Factory
    );

    testDAOUpgradeableBeaconProxy = await hre.upgrades.deployBeaconProxy(
      testDAOUpgradeableBeacon.address,
      testDAOUpgradeableV1Factory,
      [dao.address],
      {
        initializer: "init(address)"
      }
    );

    testDAOUpgradeableBeaconProxy = testDAOUpgradeableV1Factory.attach(
      testDAOUpgradeableBeaconProxy.address
    );

    const govTokenBalance = await govToken.balanceOf(govTokenSigner1Address);

    if (govTokenBalance < GOV_TO_LOCK * 3)
      throw new Error(`balance for testing DAO is too low, is ${govTokenBalance}`);

    await govToken.transfer(govTokenSigner2Address, GOV_TO_LOCK);

    await govToken.transfer(govTokenSigner3Address, GOV_TO_LOCK);

    await govToken.connect(govTokenSigner2).
      approve(veGovLockup.address, GOV_TO_LOCK);

    await govToken.connect(govTokenSigner3).
      approve(veGovLockup.address, GOV_TO_LOCK);

    await govToken.approve(veGovLockup.address, GOV_TO_LOCK);

    const maxLockupTime = await veGovLockup.maxLockTime();

    await veGovLockup.createLock(GOV_TO_LOCK, maxLockupTime);

    await veGovLockup.connect(govTokenSigner2).createLock(
      GOV_TO_LOCK,
      maxLockupTime
    );

    await veGovLockup.connect(govTokenSigner3).createLock(
      GOV_TO_LOCK,
      maxLockupTime
    );
  });

  it(
    "should fail to have a proposal go through if less than 3% of the total supply",
    async () => {}
  );

  it(
    "should have a proposal frozen if it succeeds but the time hasn't passed",
    async () => {
      // to do this, we spend / 3 of the amount that the main signer can spend
      // and advance time to the frozen point, then try to execute and check the revert
      // then check the status

      let veGovBalance = await veGovLockup.balanceOf(govTokenSigner1Address);

      expectGt(veGovBalance, 0);

      // we reduce the balance a little to accomodate for the time based
      // changing in the amounts

      veGovBalance = veGovBalance.div(3);

      const proposalId = await dao.callStatic.createProposal(
        "0x01",
        testDAOUpdates.address,
        veGovBalance,
        0,
        false,
        "0x01"
      );

      await dao.createProposal(
        "0x01",
        testDAOUpdates.address,
        veGovBalance,
        0,
        false,
        "0x01"
      );

      await expect(dao.callStatic.executeProposal(proposalId))
        .to.be.revertedWith("proposal can't execute");

      let proposalStatus = await dao.getProposalStatus(proposalId);

      expectEq(proposalStatus, PROPOSAL_STATE_UNFINISHED);

      await advanceTimeToFrozen(hre);

      // advance time with an empty transaction

      await govTokenSigner1.sendTransaction({
        to: govTokenSigner1Address,
        from: govTokenSigner1Address
      });

      await expect(dao.callStatic.executeProposal(proposalId))
        .to.be.revertedWith("proposal can't execute");

      proposalStatus = await dao.getProposalStatus(proposalId);

      expectEq(proposalStatus, PROPOSAL_STATE_FROZEN);
    }
  );

  it(
    "should succeed in getting through a proposal",
    async () => {
      // to do this, we spend / 3 of the amount that the main signer can spend
      // and advance time to past the ratification + frozen point, then test the
      // impact on our testing contract

      let veGovBalance = await veGovLockup.balanceOf(govTokenSigner1Address);

      expectGt(veGovBalance, 0);

      // we reduce the balance a little to accomodate for the time based
      // changing in the amounts

      veGovBalance = veGovBalance.div(3);

      const updateAmountTx = await testDAOUpdates.populateTransaction.updateAmount(100);

      const updateAmountCalldata = updateAmountTx.data!;

      const proposalHash = "0x02";

      const proposalId = await dao.callStatic.createProposal(
        proposalHash,
        testDAOUpdates.address,
        veGovBalance,
        0,
        false,
        updateAmountCalldata
      );

      await dao.createProposal(
        proposalHash,
        testDAOUpdates.address,
        veGovBalance,
        0,
        false,
        updateAmountCalldata
      );

      // the balance should be the same as the main signer since we locked the
      // same amount for the same time

      console.log(`ve gov balance: ${veGovBalance}`);

      const signer2Balance = veGovBalance.sub(100);

      expectGt(signer2Balance, 0);

      await dao.connect(govTokenSigner2).voteAgainst(proposalId, signer2Balance);

      await expect(dao.callStatic.executeProposal(proposalId))
        .to.be.revertedWith("proposal can't execute");

      expectEq(
        await dao.getProposalStatus(proposalId),
        PROPOSAL_STATE_UNFINISHED
      );

      await advanceTimePastProposalFinished(hre);

      // advance time with an empty transaction

      await govTokenSigner1.sendTransaction({
        to: govTokenSigner1Address,
        from: govTokenSigner1Address
      });

      expectEq(
        await dao.getProposalStatus(proposalId),
        PROPOSAL_STATE_SUCCEEDED
      );

      const previousAmount = await testDAOUpdates.amount();

      await dao.executeProposal(proposalId);

      const newAmount = await testDAOUpdates.amount();

      expect(
        previousAmount != newAmount,
        `previous amount: ${previousAmount}, new amount: ${newAmount}`
      );
    }
  );

  it(
    "should fail if the votes against a proposal exceed the votes for it",
    async () => {
      // to do this, we only spend 100 votes with the main account, and spend
      // 200 with the other accounts, then try to execute it

      let veGovBalance = await veGovLockup.balanceOf(govTokenSigner1Address);

      expectGt(veGovBalance, 300);

      veGovBalance = 100;

      const proposalHash = "0x04";

      const proposalId = await dao.callStatic.createProposal(
        proposalHash,
        testDAOUpdates.address,
        veGovBalance,
        0,
        false,
        "0x00"
      );

      await dao.createProposal(
        proposalHash,
        testDAOUpdates.address,
        veGovBalance,
        0,
        false,
        "0x00"
      );

      const againstBalance = 100;

      console.log("gov token 2");

      await dao.connect(govTokenSigner2).voteAgainst(proposalId, againstBalance);

      console.log("gov token 3");

      await dao.connect(govTokenSigner3).voteAgainst(proposalId, againstBalance);

      await expect(dao.callStatic.executeProposal(proposalId))
        .to.be.revertedWith("proposal can't execute");

      expectEq(
        await dao.getProposalStatus(proposalId),
        PROPOSAL_STATE_UNFINISHED
      );

      await advanceTimePastProposalFinished(hre);

      // advance time with an empty transaction

      await govTokenSigner1.sendTransaction({
        to: govTokenSigner1Address,
        from: govTokenSigner1Address
      });

      expectEq(
        await dao.getProposalStatus(proposalId),
        PROPOSAL_STATE_FAILED
      );

      await expect(dao.executeProposal(proposalId))
        .to.be.revertedWith("proposal can't execute");
    }
  );

  it(
    "should succeed in having a contract upgrade happen",
    async () => {
      // to do this, we set the hidden value in the contract, attempt to
      // call the function for upgrades in the V2 contract (and assume
      // that it reverts), then upgrade the contract to query that
      // information

      let veGovBalance = await veGovLockup.balanceOf(govTokenSigner1Address);

      expectGt(veGovBalance, 1);

      veGovBalance = 1;

      let proposalHash = "0x05";

      const setHiddenTx =
        await testDAOUpgradeableBeaconProxy.populateTransaction.setHidden(
          "secret word"
        );

      const setHiddenCalldata = setHiddenTx.data!;

      let proposalId = await dao.callStatic.createProposal(
        proposalHash,
        testDAOUpgradeableBeaconProxy.address,
        veGovBalance,
        0,
        false,
        setHiddenCalldata
      );

      await dao.createProposal(
        proposalHash,
        testDAOUpgradeableBeaconProxy.address,
        veGovBalance,
        0,
        false,
        setHiddenCalldata
      );

      await advanceTimePastProposalFinished(hre);

      await dao.executeProposal(proposalId);

      proposalHash = "0x06";

      // time for us to upgrade the beacon that powers this contract

      const beaconUpgradeToTx =
        await testDAOUpgradeableBeacon.populateTransaction.upgradeTo(
          testDAOUpgradeableV2Impl.address
        );

      const beaconUpgradeToCalldata = beaconUpgradeToTx.data!;

      proposalId = await dao.callStatic.createProposal(
        proposalHash,
        testDAOUpgradeableBeacon.address,
        veGovBalance,
        0,
        false,
        beaconUpgradeToCalldata
      );

      await dao.createProposal(
        proposalHash,
        testDAOUpgradeableBeacon.address,
        veGovBalance,
        0,
        false,
        beaconUpgradeToCalldata
      );

      await advanceTimePastProposalFinished(hre);

      await dao.executeProposal(proposalId);
    }
  );

  it(
    "should fail if someone tries to vote when it's concluded",
    async () => {
    }
  );

  it(
    "should succeed in using the DAO utility code to deploy a new compound token",
    async () => {
    }
  );

  it(
    "should succeed in using the DAO utility code to deploy a new aave token with default eth trf vars",
    async () => {
    }
  );

  it(
    "should succeed in using the DAO utility code to deploy a new aave token with default arb trf vars",
    async () => {
    }
  );

  it(
    "should succeed in using the DAO utility code to deploy a new liquidity pool",
    async () => {
    }
  );

  it(
    "should succeed in using the DAO utility code to upgrade the beacon for a token",
    async () => {
    }
  );

  it(
    "should succeed in using the DAO utility code to upgrade the beacon for a token",
    async () => {
    }
  );

  it(
    "should succeed in using the DAO utility code to update TRF variables for a token",
    async () => {
    }
  );

  it(
    "should succeed in using the DAO utility code to disable a token",
    async () => {
    }
  );
});
