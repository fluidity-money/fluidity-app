
import * as hre from 'hardhat';

import { expect } from 'chai';

import type { ethers } from 'ethers';

import { keccak256 } from '@ethersproject/keccak256';

import {
  commonContracts,
  commonBindings,
  commonFactories,
  commonBeaconAddresses,
  signers } from './setup-common';

import {
  deployBeacons,
  deployRegistry,
  deployOperator } from '../deployment';

import {
  expectGt,
  expectEq,
  sendEmptyTransaction,
  callAndSendProposal,
  callAndExecuteProposal } from "./test-utils";

import {
  advanceTimePastProposalFinished,
  advanceTimeToFrozen,
  PROPOSAL_STATUS_UNFINISHED,
  PROPOSAL_STATUS_FROZEN,
  PROPOSAL_STATUS_SUCCEEDED,
  PROPOSAL_STATUS_FAILED } from '../dao';

import {
  USDC_ADDR,
  CUSDC_ADDR,
  AAVE_V2_POOL_PROVIDER_ADDR,
  FEI_ADDR,
  AFEI_ADDR,
  TUSD_ADDR,
  CTUSD_ADDR } from '../test-constants';

import { EMPTY_ADDRESS } from '../script-utils';

const GOV_TO_LOCK = 3;

const advanceTime = sendEmptyTransaction;

describe("DAOStable", async () => {
  let isRunningOnMainnet: boolean;

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

  let tokenFactory: ethers.ContractFactory;

  let compoundFactory: ethers.ContractFactory;

  let daoUtilityV1Factory: ethers.ContractFactory;

  let daoUtilityV1: ethers.Contract;

  let testDAOUpgradeableBubbleUpRevert: ethers.Contract;

  let testDAOUpgradeableBeacon: ethers.Contract;

  let testDAOUpgradeableBeaconProxy: ethers.Contract;

  let tokenBeaconAddress: string;

  let registryBeaconAddress: string;

  let registry: ethers.Contract;

  let operatorBeaconAddress: string;

  let operator: ethers.Contract;

  let aaveV2BeaconAddress: string;

  let compoundBeaconAddress: string;

  let govTokenSigner1Address: string;
  let govTokenSigner2Address: string;
  let govTokenSigner3Address: string;

  before(async () => {
    isRunningOnMainnet = process.env.FLU_FORKNET_NETWORK === "mainnet";

    govToken = commonBindings.govToken.owner;

    ({
      owner: govTokenSigner1,
      extraSigner1: govTokenSigner2,
      extraSigner2: govTokenSigner3
    } = signers.govToken);

    ({
      token: tokenBeaconAddress,
      registry: registryBeaconAddress,
      compoundLiquidityProvider: compoundBeaconAddress,
      aaveV2LiquidityProvider: aaveV2BeaconAddress,
      operator: operatorBeaconAddress
    } = commonBeaconAddresses);

    ({
      token: tokenFactory,
      compoundLiquidityProvider: compoundFactory
    } = commonFactories);

    const {
      registry: registryFactory,
      operator: operatorFactory
    } = commonFactories;

    govTokenSigner1Address = await govTokenSigner1.getAddress();
    govTokenSigner2Address = await govTokenSigner2.getAddress();
    govTokenSigner3Address = await govTokenSigner3.getAddress();

    const upgradeableBeaconFactory = commonFactories.upgradeableBeacon;

    veGovLockup = commonContracts.veGovLockup.connect(govTokenSigner1);

    dao = commonContracts.dao.connect(govTokenSigner1);

    registry = await deployRegistry(
      hre,
      govTokenSigner1,
      registryFactory,
      registryBeaconAddress,
      dao.address
    );

    operator = await deployOperator(
      hre,
      govTokenSigner1,
      operatorFactory,
      operatorBeaconAddress,
      dao.address,
      govTokenSigner1Address,
      registry.address
    );

    const testDAOUpdatesFactory = await hre.ethers.getContractFactory(
      "TestDAOUpdates"
    );

    testDAOUpdates = await testDAOUpdatesFactory.deploy(dao.address);

    testDAOUpgradeableV1Factory = await hre.ethers.getContractFactory(
      "TestDAOUpgradeableV1"
    );

    testDAOUpgradeableV2Factory = await hre.ethers.getContractFactory(
      "TestDAOUpgradeableV2"
    );

    daoUtilityV1Factory = await hre.ethers.getContractFactory("DAOUtilityV1");

    daoUtilityV1 = await daoUtilityV1Factory.deploy();

    const testDAOUpgradeableBubbleUpRevertFactory = await hre.ethers.getContractFactory(
      "TestDAOUpgradeableBubbleUpRevert"
    );

    testDAOUpgradeableBubbleUpRevert =
      await testDAOUpgradeableBubbleUpRevertFactory.deploy();

    testDAOUpgradeableV2Impl = await testDAOUpgradeableV2Factory.deploy();

    [ testDAOUpgradeableBeacon ] = await deployBeacons(
      upgradeableBeaconFactory,
      dao.address,
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

      const proposalId = await callAndSendProposal(
        dao,
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

      expectEq(proposalStatus, PROPOSAL_STATUS_UNFINISHED);

      await advanceTimeToFrozen(hre);

      // advance time

      await advanceTime(govTokenSigner1);

      await expect(dao.callStatic.executeProposal(proposalId))
        .to.be.revertedWith("proposal can't execute");

      proposalStatus = await dao.getProposalStatus(proposalId);

      expectEq(proposalStatus, PROPOSAL_STATUS_FROZEN);
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

      const proposalId = await callAndSendProposal(
        dao,
        "0x02",
        testDAOUpdates.address,
        veGovBalance,
        0,
        false,
        updateAmountCalldata
      );

      await dao.voteForMax(proposalId);

      // the balance should be the same as the main signer since we locked the
      // same amount for the same time

      const signer2Balance = veGovBalance.sub(100);

      expectGt(signer2Balance, 0);

      await dao.connect(govTokenSigner2).voteAgainst(proposalId, signer2Balance);

      await expect(dao.callStatic.executeProposal(proposalId))
        .to.be.revertedWith("proposal can't execute");

      expectEq(
        await dao.getProposalStatus(proposalId),
        PROPOSAL_STATUS_UNFINISHED
      );

      await advanceTimePastProposalFinished(hre);

      await advanceTime(govTokenSigner1);

      expectEq(
        await dao.getProposalStatus(proposalId),
        PROPOSAL_STATUS_SUCCEEDED
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

      expectGt(veGovBalance, 3e6);

      veGovBalance = 1e6;

      const proposalId = await callAndSendProposal(
        dao,
        "0x04",
        testDAOUpdates.address,
        veGovBalance,
        0,
        false,
        "0x00"
      );

      const againstBalance = 1e6;

      await dao.connect(govTokenSigner2).voteAgainst(proposalId, againstBalance);

      await dao.connect(govTokenSigner3).voteAgainst(proposalId, againstBalance);

      await expect(dao.callStatic.executeProposal(proposalId))
        .to.be.revertedWith("proposal can't execute");

      expectEq(
        await dao.getProposalStatus(proposalId),
        PROPOSAL_STATUS_UNFINISHED
      );

      await advanceTimePastProposalFinished(hre);

      await advanceTime(govTokenSigner1);

      expectEq(
        await dao.getProposalStatus(proposalId),
        PROPOSAL_STATUS_FAILED
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

      // make sure that the dao is actually the owner of the beacon so we can upgrade it

      expect(await testDAOUpgradeableBeacon.owner()).to.be.hexEqual(dao.address);

      const hiddenSecretWord = "secret word";

      const setHiddenTx =
        await testDAOUpgradeableBeaconProxy.populateTransaction.setHidden(
          hiddenSecretWord
        );

      const setHiddenCalldata = setHiddenTx.data!;

      let proposalId = await callAndSendProposal(
        dao,
        "0x05",
        testDAOUpgradeableBeaconProxy.address,
        0,
        0,
        false,
        setHiddenCalldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await dao.executeProposal(proposalId);

      const upgradeFragment = testDAOUpgradeableBeacon.interface.getFunction(
        "upgradeTo"
      );

      const upgradeCalldata =
        testDAOUpgradeableBeacon.interface.encodeFunctionData(
          upgradeFragment,
          [testDAOUpgradeableV2Impl.address]
        );

      const testDAOUpgradeableBeaconAddress = testDAOUpgradeableBeacon.address;

      proposalId = await callAndSendProposal(
        dao,
        "0x06",
        testDAOUpgradeableBeaconAddress,
        0,
        0,
        false,
        upgradeCalldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await dao.executeProposal(proposalId);

      const hidden = await testDAOUpgradeableV2Factory
        .attach(testDAOUpgradeableBeaconProxy.address)
        .getHidden();

      expect(hidden).to.be.equal(hiddenSecretWord);
    }
  );

  it(
    "should hash the input data correctly",
    async () => {
      let veGovBalance = await veGovLockup.balanceOf(govTokenSigner1Address);

      expectGt(veGovBalance, 1);

      veGovBalance = 1;

      const ipfsHash = "0x1234";
      const target = govTokenSigner1Address;
      const isDelegateCall = true;
      const calldata = "0x00";

      const bytes = hre.ethers.utils.defaultAbiCoder.encode(
        [ "bytes", "address", "bool", "bytes" ],
        [
          ipfsHash,
          target,
          isDelegateCall,
          calldata
        ]
      );

      const proposalId_ = keccak256(hre.ethers.utils.arrayify(bytes));

      const proposalId = await dao.callStatic.createProposal(
        ipfsHash,
        target,
        0,
        0,
        isDelegateCall,
        calldata
      );

      expect(proposalId).to.be.hexEqual(proposalId_);
    }
  )

  it(
    "should fail if someone tries to vote after voting's over",
    async () => {
      // to do this, we set the votes in a proposal to make it fail then try to
      // vote for it after it's finished after verifying the state is accurate

      let veGovBalance = await veGovLockup.balanceOf(govTokenSigner1Address);

      expectGt(veGovBalance, 1);

      veGovBalance = 1;

      const proposalId = await callAndSendProposal(
        dao,
        "0x07",
        testDAOUpgradeableBeaconProxy.address,
        0,
        0,
        false,
        "0x00"
      );

      await advanceTimePastProposalFinished(hre);

      await advanceTime(govTokenSigner1);

      expectEq(
        await dao.getProposalStatus(proposalId),
        PROPOSAL_STATUS_FAILED
      );

      await expect(dao.voteFor(proposalId, veGovBalance))
        .to.be.revertedWith("proposal not voteable");
    }
  );

  it(
    "should succeed in using the DAO utility code for deployNewCompoundToken",
    async function() {
      if (!isRunningOnMainnet) this.skip();

      const tokenDecimals = 6;

      const trfVariables = {
        currentAtxTransactionMargin: 123,
        defaultTransfersInBlock: 2222,
        spoolerInstantRewardThreshold: 1881,
        spoolerBatchedRewardThreshold: 99,
        defaultSecondsSinceLastBlock: 122,
        atxBufferSize: 10
      };

      const daoUtilityV1Tx = await daoUtilityV1.populateTransaction.deployNewCompoundToken(
        tokenBeaconAddress,
        compoundBeaconAddress,
        registry.address,
        {
          cToken: CUSDC_ADDR,
        },
        {
          liquidityProvider: EMPTY_ADDRESS,
          fluidTokenName: "Fluid USDC 2",
          fluidSymbol: "fUSDC2",
          emergencyCouncil: govTokenSigner1Address,
          oracle: govTokenSigner1Address,
          decimals: tokenDecimals
        },
        trfVariables,
        operator.address
      );

      const daoUtilityV1Calldata = daoUtilityV1Tx.data!;

      const proposalId = await callAndSendProposal(
        dao,
        "0x01",
        daoUtilityV1.address,
        0,
        0,
        true,
        daoUtilityV1Calldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await sendEmptyTransaction(govTokenSigner1);

      const returnData = await callAndExecuteProposal(dao, proposalId);

      const [
        liquidityProviderAddress,
        tokenAddress
      ] = hre.ethers.utils.defaultAbiCoder.decode(
        ["address", "address"],
        returnData
      );

      expect(await tokenFactory.attach(tokenAddress).decimals())
        .to.be.equal(tokenDecimals);

      expect(await compoundFactory.attach(liquidityProviderAddress).underlying_())
        .to.be.hexEqual(USDC_ADDR);

      const setTrfVariables = await registry.getTrfVariables(tokenAddress);

      expect(setTrfVariables[0]).to.be.equal(trfVariables.currentAtxTransactionMargin);
      expect(setTrfVariables[1]).to.be.equal(trfVariables.defaultTransfersInBlock);
      expect(setTrfVariables[2]).to.be.equal(trfVariables.spoolerInstantRewardThreshold);
      expect(setTrfVariables[3]).to.be.equal(trfVariables.spoolerBatchedRewardThreshold);
      expect(setTrfVariables[4]).to.be.equal(trfVariables.defaultSecondsSinceLastBlock);
      expect(setTrfVariables[5]).to.be.equal(trfVariables.atxBufferSize);
    }
  );

  it(
    "should succeed in using the DAO utility code to deploy a new compound token with default eth trf vars",
    async function() {
      if (!isRunningOnMainnet) this.skip();

      const tokenDecimals = 6;

      const daoUtilityV1Tx =
        await daoUtilityV1.populateTransaction.deployNewCompoundTokenWithDefaultEthTrfVars(
          tokenBeaconAddress,
          compoundBeaconAddress,
          registry.address,
          {
            cToken: CUSDC_ADDR,
          },
          {
            liquidityProvider: EMPTY_ADDRESS,
            fluidTokenName: "Fluid USDC 3",
            fluidSymbol: "fUSDC2",
            emergencyCouncil: govTokenSigner1Address,
            oracle: govTokenSigner1Address,
            decimals: tokenDecimals
          },
          operator.address
        );

      const daoUtilityV1Calldata = daoUtilityV1Tx.data!;

      const proposalId = await callAndSendProposal(
        dao,
        "0x2d",
        daoUtilityV1.address,
        0,
        0,
        true,
        daoUtilityV1Calldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await sendEmptyTransaction(govTokenSigner1);

      const returnData = await callAndExecuteProposal(dao, proposalId);

      const [
        liquidityProviderAddress,
        tokenAddress
      ] = hre.ethers.utils.defaultAbiCoder.decode(
        ["address", "address"],
        returnData
      );

      expect(await tokenFactory.attach(tokenAddress).decimals())
        .to.be.equal(tokenDecimals);

      expect(await compoundFactory.attach(liquidityProviderAddress).underlying_())
        .to.be.hexEqual(USDC_ADDR);

      expect(await registry.getTrfVariables(tokenAddress))
        .to.deep.equal(await daoUtilityV1.defaultEthereumTrfVariables());
    }
  );

  it(
    "should succeed in using the DAO utility code to deploy a new aave V2 token with default arb trf vars",
    async function() {
      if (!isRunningOnMainnet) this.skip();

      const tokenDecimals = 18;

      const daoUtilityV1Tx =
        await daoUtilityV1.populateTransaction.deployNewAaveV2TokenWithDefaultArbTrfVars(
          tokenBeaconAddress,
          aaveV2BeaconAddress,
          registry.address,
          {
            addressProvider: AAVE_V2_POOL_PROVIDER_ADDR,
            aToken: AFEI_ADDR,
          },
          {
            liquidityProvider: EMPTY_ADDRESS,
            fluidTokenName: "Fluid Fei 2",
            fluidSymbol: "fFEI2",
            emergencyCouncil: govTokenSigner1Address,
            oracle: govTokenSigner1Address,
            decimals: tokenDecimals
          },
          operator.address
        );

      const daoUtilityV1Calldata = daoUtilityV1Tx.data!;

      const proposalId = await callAndSendProposal(
        dao,
        "0x3d",
        daoUtilityV1.address,
        0,
        0,
        true,
        daoUtilityV1Calldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await sendEmptyTransaction(govTokenSigner1);

      const returnData = await callAndExecuteProposal(dao, proposalId);

      const [
        liquidityProviderAddress,
        tokenAddress
      ] = hre.ethers.utils.defaultAbiCoder.decode(
        ["address", "address"],
        returnData
      );

      expect(await tokenFactory.attach(tokenAddress).decimals())
        .to.be.equal(tokenDecimals);

      expect(await compoundFactory.attach(liquidityProviderAddress).underlying_())
        .to.be.hexEqual(FEI_ADDR);

      expect(await registry.getTrfVariables(tokenAddress))
        .to.deep.equal(await daoUtilityV1.defaultArbitrumTrfVariables());
    }
  );

  it(
    "should succeed in using the DAO utility code to update TRF variables for a token",
    async function() {
      if (!isRunningOnMainnet) this.skip();

      const tokenDecimals = 18;

      const daoUtilityV1DeployTx =
        await daoUtilityV1.populateTransaction.deployNewAaveV2TokenWithDefaultArbTrfVars(
          tokenBeaconAddress,
          aaveV2BeaconAddress,
          registry.address,
          {
            addressProvider: AAVE_V2_POOL_PROVIDER_ADDR,
            aToken: AFEI_ADDR,
          },
          {
            liquidityProvider: EMPTY_ADDRESS,
            fluidTokenName: "Fluid Fei 3",
            fluidSymbol: "fFEI3",
            emergencyCouncil: govTokenSigner1Address,
            oracle: govTokenSigner1Address,
            decimals: tokenDecimals
          },
          operator.address
        );

      const daoUtilityV1DeployCalldata = daoUtilityV1DeployTx.data!;

      let proposalId = await callAndSendProposal(
        dao,
        "0x3d",
        daoUtilityV1.address,
        0,
        0,
        true,
        daoUtilityV1DeployCalldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await sendEmptyTransaction(govTokenSigner1);

      const returnData = await callAndExecuteProposal(dao, proposalId);

      const [
        liquidityProviderAddress,
        tokenAddress
      ] = hre.ethers.utils.defaultAbiCoder.decode(
        ["address", "address"],
        returnData
      );

      expect(await tokenFactory.attach(tokenAddress).decimals())
        .to.be.equal(tokenDecimals);

      expect(await compoundFactory.attach(liquidityProviderAddress).underlying_())
        .to.be.hexEqual(FEI_ADDR);

      expect(await registry.getTrfVariables(tokenAddress))
        .to.deep.equal(await daoUtilityV1.defaultArbitrumTrfVariables());

      const daoUtilityV1UpdateTx =
        await daoUtilityV1.populateTransaction.updateTrfVariables(
          registry.address,
          tokenAddress,
          1,
          2,
          3,
          4,
          5,
          6
        );

      const daoUtilityV1UpdateCalldata = daoUtilityV1UpdateTx.data!;

      proposalId = await callAndSendProposal(
        dao,
        "0x4d",
        daoUtilityV1.address,
        0,
        0,
        true,
        daoUtilityV1UpdateCalldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await dao.executeProposal(proposalId);

      await sendEmptyTransaction(govTokenSigner1);

      const trfVariables = await registry.getTrfVariables(tokenAddress);

      expect(trfVariables.currentAtxTransactionMargin).to.equal(1);
      expect(trfVariables.defaultTransfersInBlock).to.equal(2);
      expect(trfVariables.spoolerInstantRewardThreshold).to.equal(3);
      expect(trfVariables.spoolerBatchedRewardThreshold).to.equal(4);
      expect(trfVariables.defaultSecondsSinceLastBlock).to.equal(5);
      expect(trfVariables.atxBufferSize).to.equal(6);
    }
  );

  it(
    "should succeed in using the DAO utility code to disable a token",
    async function() {
      if (!isRunningOnMainnet) this.skip();

      const tokenDecimals = 18;

      const daoUtilityV1DeployTx =
        await daoUtilityV1.populateTransaction.deployNewCompoundTokenWithDefaultArbTrfVars(
          tokenBeaconAddress,
          compoundBeaconAddress,
          registry.address,
          {
            cToken: CTUSD_ADDR,
          },
          {
            liquidityProvider: EMPTY_ADDRESS,
            fluidTokenName: "Fluid TUSD 2",
            fluidSymbol: "fTUSD2",
            emergencyCouncil: govTokenSigner1Address,
            oracle: govTokenSigner1Address,
            decimals: tokenDecimals
          },
          operator.address
        );

      const daoUtilityV1DeployCalldata = daoUtilityV1DeployTx.data!;

      let proposalId = await callAndSendProposal(
        dao,
        "0x77",
        daoUtilityV1.address,
        0,
        0,
        true,
        daoUtilityV1DeployCalldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await sendEmptyTransaction(govTokenSigner1);

      const returnData = await callAndExecuteProposal(dao, proposalId);

      const [
        liquidityProviderAddress,
        tokenAddress
      ] = hre.ethers.utils.defaultAbiCoder.decode(
        ["address", "address"],
        returnData
      );

      expect(await tokenFactory.attach(tokenAddress).decimals())
        .to.be.equal(tokenDecimals);

      expect(await compoundFactory.attach(liquidityProviderAddress).underlying_())
        .to.be.hexEqual(TUSD_ADDR);

      expect(await registry.getTrfVariables(tokenAddress))
        .to.deep.equal(await daoUtilityV1.defaultArbitrumTrfVariables());

      const daoUtilityV1DisableTx =
        await daoUtilityV1.populateTransaction.disableAddresses([tokenAddress]);

      const daoUtilityV1DisableCalldata = daoUtilityV1DisableTx.data!;

      proposalId = await callAndSendProposal(
        dao,
        "0x99",
        daoUtilityV1.address,
        0,
        0,
        true,
        daoUtilityV1DisableCalldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await sendEmptyTransaction(govTokenSigner1);

      await callAndExecuteProposal(dao, proposalId);

      expect(await tokenFactory.attach(tokenAddress).noEmergencyMode())
        .to.be.false;
    }
  );

  it(
    "should have an error calling a contract then bubbling up the message correctly",
    async () => {
      // to do this, we get through a proposal that just calls
      // TestDAOUpgradeableBubbleUpRevert

      const bubbleUpTx =
        await testDAOUpgradeableBubbleUpRevert.populateTransaction.callMe();

      const bubbleUpCalldata = bubbleUpTx.data!;

      const proposalId = await callAndSendProposal(
        dao,
        "0x0a",
        testDAOUpgradeableBubbleUpRevert.address,
        0,
        0,
        false,
        bubbleUpCalldata
      );

      await dao.voteForMax(proposalId);

      await advanceTimePastProposalFinished(hre);

      await expect(dao.executeProposal(proposalId))
        .to.be.revertedWith("uhoh!");
    }
  );

  it(
    "should fail to vote on a proposal that isn't live yet",
    async function() {
      if (!isRunningOnMainnet) this.skip();

      const proposalId = await dao.callStatic.createProposal(
        "0x99",
        govTokenSigner1Address,
        0,
        0,
        false,
        "0x00"
      );

      await dao.voteAgainstMax(proposalId);

      await expect(dao.callStatic.voteFor(proposalId, 1))
        .to.be.revertedWith("proposal does not exist");
    }
  );

  it("should fail if the amount voted is less than 3%", async () => {

  });
});
