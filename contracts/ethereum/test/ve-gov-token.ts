
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
  WETH_ADDR } from "../arbitrum-constants";

import { getLatestTimestamp } from "../script-utils";

const TokenName = "Balancer LP VE test";

const TokenSymbol = "veballp";

const AddressZero = ethers.constants.AddressZero;

const MaxUint256 = ethers.constants.MaxUint256;

// keccak("PoolCreated(address)")
const PoolCreatedTopic = "0x83a48fbcfc991335314e74d0496aab6a1987e992ddc85dddbcc4d6dd6ef2e9fc";

const getVEFluidBalanceArgs = [
  [34000000000,1209600,4.117085616438356],
  [211,4880256,32.65265144596651],
  [530,6189975,104.0298944063927],
  [60,11708542,22.27652587519026],
  [696,3789303,83.62997488584475],
  [51,24592490,39.77095985540335],
  [75,31342204,74.53910768645358],
  [206,4274826,27.924091704718418],
  [570,29027798,524.6652987062405],
  [922,2168346,63.39469216133942],
  [864,654484,17.931068493150686],
  [818,21981012,570.156894216134],
  [409,13528534,175.45568258498224],
  [278,28205359,248.63932654743786],
  [825,29052526,760.0308837519026],
  [391,25255715,313.13370639903604],
  [430,2009844,27.404646118721462],
  [779,17582025,434.3099148592085],
  [533,6879099,116.26584750761035],
  [425,29731259,400.6781162798072],
  [562,9834464,175.25902993404364],
  [244,27774345,214.89536339421613],
  [293,3415734,31.73547888127854],
  [555,18400347,323.82650256849314],
  [985,23851256,744.9735908168442],
  [643,15121676,308.32184386098425],
  [200,3769721,23.907413749365805],
  [450,9734579,138.90666381278538],
  [904,3345339,95.89632343987823],
  [615,12286146,239.59854737442922],
  [626,17018541,337.8236512557078],
  [835,30698432,812.8231456113648],
  [321,24851711,252.96167018645357],
  [895,14753996,418.7222989599188],
  [297,26417436,248.79434589041097],
  [876,26789057,744.1404722222222],
  [740,17214872,403.9512075088787],
  [378,332525,3.9857448630136987],
  [582,19905877,367.36492941400303],
  [85,15917965,42.90420551116185],
  [977,26816615,830.7912498414511],
  [247,10538340,82.53963660578387],
  [210,29572367,196.92405726788434],
  [216,13291637,91.0386095890411],
  [328,7295405,75.87813419583968],
  [385,978663,11.947782058599696],
  [55,3510952,6.123235667174023],
  [362,29620442,340.0114156519533],
  [386,25710884,314.70069837645866],
  [121,6235705,23.92568191907661],
  [744,24366154,574.8483820395738],
  [218,20014940,138.35796930492137],
  [884,25789439,722.9155275240994],
  [74,23123209,54.25917890664637],
  [366,29125526,338.0245597412481],
  [879,21875333,609.7291256659056],
  [782,1343156,33.30631633688483],
  [321,16110388,163.98511377473363],
  [753,8897422,212.4479568112633],
  [482,8222249,125.6698382166413],
  [61,26109252,50.50305593607306],
  [186,18233664,107.5425388127854],
  [930,18817839,554.9400770547945],
  [902,5741265,164.21299562404872],
  [343,15947793,173.45551113013698],
  [876,12013526,333.70905555555555],
  [121,13821119,53.030041825215626],
  [35,14389234,15.969786593099949],
  [291,14935225,137.81552749238966],
  [724,6974027,160.10894051243025],
  [80,18730257,47.514604261796045],
  [792,24461980,614.3419634703197],
  [564,23590304,421.8966088280061],
  [368,18849033,219.953200913242],
  [665,18186216,383.4929490106545],
  [264,30563697,255.86047716894979],
  [798,27740243,701.9505934170472],
  [377,30632739,366.2018836567732],
  [381,6611041,79.87083399923897],
  [638,27928841,565.0241171359716],
  [674,3995864,85.40120294266869],
  [323,4421111,45.2821807775241],
  [749,19557189,464.49564183789954],
  [561,1213467,21.586599029680364],
  [406,23399013,301.24300095129377],
  [543,30983956,533.4946761796043],
  [985,19319040,603.413698630137],
  [526,15203924,253.59157864028413],
  [631,27801794,556.2827249492643],
  [675,5506284,117.85710616438357],
  [324,28662928,294.4821369863014],
  [259,13367466,109.78480764840182],
  [4,31078826,3.942012430238458],
  [268,10126377,86.05622260273972],
  [595,22836080,430.85577118214104],
  [733,19521967,453.754496797311],
  [152,20711976,99.82941248097413],
  [855,9612534,260.61379280821916],
  [639,1809229,36.659605878995436]
];

function flipIf<T>(t: boolean, arr: T[]): T[] {
  return t ? arr : [arr[1], arr[0]];
}

describe("VEGovToken", async () => {
  let signer: ethers.Signer;
  let signerAddress: string;

  let govToken: ethers.Contract;
  let wethToken: ethers.Contract;

  let balancerVault: ethers.Contract;
  let veGovToken: ethers.Contract;
  let weightedPool: ethers.Contract;

  let poolId: ethers.BytesLike;

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK !== "arbitrum") this.skip();

    [signer] = await hre.ethers.getSigners();

    signerAddress = await signer.getAddress();

    const {
      veGovToken: veGovTokenFactory,
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
      weightedPoolReceipt.events.filter(({ topics }: { topics: string[] }) =>
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
      maxAmountsIn: flipIf(wethGreaterThanGov, [ govTokenBal, wethTokenBal ]),
      userData: ethers.utils.defaultAbiCoder.encode(
        [ "uint256", "uint256[]" ],
        [ 0, initialBalances ]
      ),
      fromInternalBalance: false
    });

    await balancerVault.joinPool(poolId, signerAddress, signerAddress, {
      assets: sortedAssets,
      maxAmountsIn: flipIf(wethGreaterThanGov, [ govTokenBal, wethTokenBal ]),
      userData: ethers.utils.defaultAbiCoder.encode(
        [ "uint256", "uint256" ],
        [ 3, 0 ]
      ),
      fromInternalBalance: false
    });

    expect(await weightedPool.balanceOf(signerAddress)).to.be.gt(0);

    veGovToken = await veGovTokenFactory.deploy(
      weightedPool.address,
      "VE Gov Token",
      "VET",
      "0"
    );

    await weightedPool.approve(veGovToken.address, MaxUint256);
  });

  it("should display the balance correctly", async () => {
    for (const i in getVEFluidBalanceArgs) {
      // bptLocked: amount that we want to lockup
      // lockTime: seconds that we want to lock
      // veFluid_: the amount that we expect we should get in return

      const [bptLocked, lockTime_, veFluid_] = getVEFluidBalanceArgs[i];

      const timestamp = await getLatestTimestamp(hre);

      console.log("timestamp:", timestamp);

      const lockTime = BigNumber.from(timestamp).add(lockTime_);

      const snapshotId = await hre.network.provider.request({
        method: "evm_snapshot",
        params: []
      });

      expect(
        await veGovToken.getVotes(signerAddress),
        "initial ve gov token"
      ).to.equal(0);

      console.log("bptLocked:", bptLocked);
      console.log("lockTime:", lockTime);
      console.log("expecting that we'll get:", veFluid_);

      const veFluid = BigNumber.from(BigInt(veFluid_ * 1e18));

      await veGovToken.create_lock(bptLocked, lockTime);

      // const epoch = await veGovToken.epoch();

      // console.log("await veGovToken.global history epoch", epoch, ":", await veGovToken.point_history(epoch));

      // const userPointEpoch  = await veGovToken.user_point_epoch(signerAddress);

      // expect(await veGovToken["balanceOf(address)"](signerAddress)).to.equal(veFluid);

      expect(await veGovToken.getVotes(signerAddress)).to.be.equal(veFluid);

      expect(213).to.be.equal(11111);

      await hre.network.provider.request({
        method: "evm_revert",
        params: [snapshotId]
      });
    }
  });
});
