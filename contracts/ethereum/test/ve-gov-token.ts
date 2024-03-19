
// this test suite is more *involved* testing that involves creating a
// balancer pool for a newly deployed token with the same tokenomics as
// the FLUID token, taking that then creating a 70/30 WETH pool then
// simulating some inputs to the ve gov lockup

import * as hre from "hardhat";

import { ethers } from "ethers";

import { BigNumber } from "ethers";

import { expect } from "chai";

import { commonFactories } from "./setup-common";

import {
  BALANCER_VAULT_ADDR,
  BALANCER_WEIGHTED_POOL_FACTORY_ADDR,
  WETH_ADDR
} from "../arbitrum-constants";

import { getLatestTimestamp } from "../script-utils";

const TokenName = "Balancer LP VE test";

const TokenSymbol = "veballp";

const AddressZero = ethers.constants.AddressZero;

const MaxUint256 = ethers.constants.MaxUint256;

// keccak("PoolCreated(address)")
const PoolCreatedTopic = "0x83a48fbcfc991335314e74d0496aab6a1987e992ddc85dddbcc4d6dd6ef2e9fc";

// we've observed that vyper's locktime seems to be around 0 days and 10
// hours incorrect from what we put in, this test data accomodates that
// assumption
const getVEFluidBalanceArgs = [
  [ "5800000000", 22982400, "4226849315" ],
  [ "94100000000", 29635200, "88428219178" ],
  [ "4600000000", 12700800, "1852602739" ],
  [ "15900000000", 22377600, "11282465753" ],
  [ "80800000000", 27820800, "71281095890" ],
  [ "88900000000", 22377600, "63082465753" ],
  [ "97000000000", 15120000, "46506849315" ],
  [ "6400000000", 27820800, "5646027397" ],
  [ "49900000000", 16934400, "26795616438" ],
  [ "30300000000", 30240000, "29054794520" ],
  [ "44700000000", 19958400, "28289589041" ],
  [ "58000000000", 26611200, "48942465753" ],
  [ "45700000000", 12096000, "17528767123" ],
  [ "57000000000", 12700800, "22956164383" ],
  [ "85600000000", 26611200, "72232328767" ],
  [ "69800000000", 10281600, "22756712328" ],
  [ "92900000000", 30844800, "90863835616" ],
  [ "24800000000", 19958400, "15695342465" ],
  [ "73400000000", 28425600, "66160547945" ],
  [ "11100000000", 16934400, "5960547945" ],
  [ "57400000000", 13305600, "24218082191" ],
  [ "25400000000", 30844800, "24843287671" ],
  [ "89600000000", 18144000, "51550684931" ],
  [ "22400000000", 13305600, "9450958904" ],
  [ "51700000000", 30844800, "50566849315" ],
  [ "42400000000", 25401600, "34152328767" ],
  [ "46600000000", 9072000, "13405479452" ],
  [ "43800000000", 11491200, "15960000000" ],
  [ "39600000000", 18748800, "23543013698" ],
  [ "17100000000", 29635200, "16069315068" ],
  [ "40400000000", 19958400, "25568219178" ],
  [ "65700000000", 9676800, "20160000000" ],
  [ "64800000000", 25401600, "52195068493" ],
  [ "96100000000", 29635200, "90307671232" ],
  [ "67100000000", 19958400, "42466027397" ],
  [ "26200000000", 25401600, "21103561643" ],
  [ "4100000000", 26006400, "3381095890" ],
  [ "5000000000", 21772800, "3452054794" ],
  [ "25500000000", 17539200, "14182191780" ],
  [ "21700000000", 18748800, "12901095890" ],
  [ "73200000000", 9676800, "22461369863" ],
  [ "70300000000", 29030400, "64714520547" ],
  [ "51400000000", 18748800, "30558356164" ],
  [ "53100000000", 9072000, "15275342465" ],
  [ "53700000000", 11491200, "19567397260" ],
  [ "39500000000", 15724800, "19695890410" ],
  [ "54400000000", 13910400, "23995616438" ],
  [ "68300000000", 19958400, "43225479452" ],
  [ "98500000000", 11491200, "35891780821" ],
  [ "37700000000", 28425600, "33981643835" ],
  [ "14300000000", 27820800, "12615342465" ],
  [ "22800000000", 15724800, "11368767123" ],
  [ "24100000000", 10886400, "8319452054" ],
  [ "69400000000", 19353600, "42590684931" ],
  [ "68800000000", 13910400, "30347397260" ],
  [ "78200000000", 10281600, "25495342465" ],
  [ "54400000000", 16329600, "28168767123" ],
  [ "26300000000", 13910400, "11600821917" ],
  [ "89800000000", 18144000, "51665753424" ],
  [ "96900000000", 21772800, "66900821917" ],
  [ "27000000000", 18144000, "15534246575" ],
  [ "200000000", 8467200, "53698630" ],
  [ "29100000000", 11491200, "10603561643" ],
  [ "92500000000", 10281600, "30157534246" ],
  [ "55900000000", 29635200, "52530684931" ],
  [ "57400000000", 11491200, "20915616438" ],
  [ "18900000000", 13305600, "7974246575" ],
  [ "81200000000", 9676800, "24916164383" ],
  [ "63400000000", 12096000, "24317808219" ],
  [ "98900000000", 29030400, "91042191780" ],
  [ "81300000000", 25401600, "65485479452" ],
  [ "37400000000", 11491200, "13627945205" ],
  [ "8900000000", 11491200, "3243013698" ],
  [ "67900000000", 25401600, "54692054794" ],
  [ "75700000000", 29030400, "69685479452" ],
  [ "38800000000", 13305600, "16370410958" ],
  [ "34200000000", 24192000, "26235616438" ]
];

function flipIf<T>(t : boolean, arr : T[]) : T[] {
  return t ? arr : [arr[1], arr[0]];
}

describe("VETestGovToken", async () => {
  let signer : ethers.Signer;
  let signerAddress : string;

  let govToken : ethers.Contract;
  let wethToken : ethers.Contract;

  let balancerVault : ethers.Contract;
  let veTestGovToken : ethers.Contract;
  let weightedPool : ethers.Contract;

  let poolId : ethers.BytesLike;

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK !== "arbitrum") this.skip();

    [signer] = await hre.ethers.getSigners();

    signerAddress = await signer.getAddress();

    const {
      veTestGovToken: veTestGovTokenFactory,
      govToken: govTokenFactory } = commonFactories;

    // set up the balancer pool so we can get some voting power units

    const weightedPoolFactory = await hre.ethers.getContractAt(
      "TestBalancerWeightedPoolFactory",
      BALANCER_WEIGHTED_POOL_FACTORY_ADDR
    );

    balancerVault = await hre.ethers.getContractAt(
      "TestBalancerVault",
      BALANCER_VAULT_ADDR
    );

    govToken = await govTokenFactory.deploy(
      TokenName,
      TokenSymbol,
      18,
      MaxUint256
    );

    wethToken =
      (await hre.ethers.getContractAt("TestWETH", WETH_ADDR))
        .connect(signer);

    const wethGreaterThanGov =
      BigNumber.from(wethToken.address).gt(govToken.address);

    const sortedAssets = flipIf(wethGreaterThanGov, [
      govToken.address,
      wethToken.address
    ]);

    const initialBalances = flipIf(wethGreaterThanGov, [
      BigNumber.from("700000000000000000"), // 70%
      BigNumber.from("300000000000000000") // 30%
    ]);

    const weightedPoolTx = await weightedPoolFactory.create(
      TokenName,
      TokenSymbol,
      sortedAssets,
      initialBalances,
      [AddressZero, AddressZero], // rate providers
      0.005e18,
      AddressZero,
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );

    const weightedPoolReceipt = await weightedPoolTx.wait();

    const weightedPoolEvents =
      weightedPoolReceipt.events.filter(({ topics } : { topics : string[] }) =>
        topics[0] === PoolCreatedTopic);

    const weightedPoolAddr =
      ethers.utils.getAddress(weightedPoolEvents[0].topics[1].slice(26));

    await govToken.approve(BALANCER_VAULT_ADDR, MaxUint256);
    await wethToken.approve(BALANCER_VAULT_ADDR, MaxUint256);

    weightedPool = await hre.ethers.getContractAt(
      "TestBalancerWeightedPool",
      weightedPoolAddr
    );

    poolId = await weightedPool.getPoolId();

    const ethBalBefore = BigNumber.from(await hre.network.provider.request({
      method: "eth_getBalance",
      params: [signerAddress]
    }));

    const wethDepositAmount = MaxUint256.div(2);

    await hre.network.provider.request({
      method: "hardhat_setBalance",
      params: [signerAddress, wethDepositAmount.toHexString()]
    });

    const spendable = wethDepositAmount.sub(ethBalBefore);

    await wethToken.deposit({ value: spendable });

    const wethTokenBal = await wethToken.balanceOf(signerAddress);

    expect(await wethToken.balanceOf(signerAddress)).to.be.equal(spendable);

    const govTokenBal = await govToken.balanceOf(signerAddress);

    expect(govTokenBal).to.be.equal(MaxUint256);

    await balancerVault.joinPool(poolId, signerAddress, signerAddress, {
      assets: sortedAssets,
      maxAmountsIn: flipIf(wethGreaterThanGov, [govTokenBal, wethTokenBal]),
      userData: ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256[]"],
        [0, initialBalances]
      ),
      fromInternalBalance: false
    });

    await balancerVault.joinPool(poolId, signerAddress, signerAddress, {
      assets: sortedAssets,
      maxAmountsIn: flipIf(wethGreaterThanGov, [govTokenBal, wethTokenBal]),
      userData: ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256"],
        [3, 0]
      ),
      fromInternalBalance: false
    });

    expect(await weightedPool.balanceOf(signerAddress)).to.be.gt(0);

    veTestGovToken = await veTestGovTokenFactory.deploy(
      weightedPool.address,
      "VE Gov Token",
      "VET",
      "0"
    );

    await weightedPool.approve(veTestGovToken.address, MaxUint256);
  });

  it("should display the balance correctly", async () => {
    for (const [bptLocked_, lockTime_, veFluid_] of getVEFluidBalanceArgs) {
      // bptLocked: amount that we want to lockup
      // lockTime: seconds that we want to lock
      // veFluid_: the amount that we expect we should get in return

      const bptLocked = BigNumber.from(bptLocked_);

      const timestamp = await getLatestTimestamp(hre);

      const lockTime = BigNumber.from(lockTime_);

      const timestampAddLockTime = BigNumber.from(timestamp).add(lockTime_);

      const snapshotId = await hre.network.provider.request({
        method: "evm_snapshot",
        params: []
      });

      expect(
        await veTestGovToken.getVotes(signerAddress),
        "initial ve gov token"
      ).to.equal(0);

      const veFluid = BigNumber.from(veFluid_);

      await veTestGovToken.create_lock(bptLocked, timestampAddLockTime);

      // check that the difference is below 5 days, and more than 4 days

      // 864000 = 10 days
      // 31536000 = 365 days

      const votes = await veTestGovToken.getVotes(signerAddress);

      // we have to assert that if the difference is greater than 0, but
      // if it's less than 4 it should be greater

      const expectErrMsg =
        `bptlocked: ${bptLocked}, veFluid: ${veFluid}, lockTime: ${lockTime}, timestamp add locktime: ${timestampAddLockTime}`;

      // test that the difference is greater than 0 days
      expect(
        BigNumber.from(bptLocked).mul(lockTime).div(31536000),
        `expected greater than 0 days, ${expectErrMsg}`
      )
        .to.be.gt(votes);

      // test that the difference is less than 10 days
      expect(
        BigNumber.from(bptLocked).mul(lockTime.sub(864000)).div(31536000),
        `expected less than 10 days, ${expectErrMsg}`
      )
        .to.be.lt(votes);

      await hre.network.provider.request({
        method: "evm_revert",
        params: [snapshotId]
      });
    }
  });
});
