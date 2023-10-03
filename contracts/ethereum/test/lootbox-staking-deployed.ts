
/**
 * These tests are only available on Arbitrum forknets!
 *
 * These tests are ran using the currently deployed tokens and
 * contract state on Arbitrum mainnet
 */

import * as hre from "hardhat";

import { ethers, BigNumber } from "ethers";

import { expect } from "chai";

import {
  USUAL_FUSDC_ADDR,
  USDC_ADDR,
  WETH_ADDR,
  USDC_HOLDER,
  CAMELOT_ROUTER,
  CAMELOT_FUSDC_USDC_PAIR,
  CAMELOT_FUSDC_WETH_PAIR,
  SUSHISWAP_FUSDC_USDC_POOL,
  USUAL_LOOTBOX_STAKING,
  SUSHISWAP_TRIDENT_ROUTER,
  SUSHISWAP_BENTO_BOX,
  SUSHISWAP_FUSDC_WETH_POOL } from "../arbitrum-constants";

import LootboxTests from "./lootbox-tests";

import type { lootboxTestsArgs } from "./lootbox-tests";

import { allocateRatio } from "../lootbox-utils";

import { advanceTime, sendEmptyTransaction } from './test-utils';

const MaxUint256 = ethers.constants.MaxUint256;

const Zero = ethers.constants.Zero;

describe("LootboxStaking deployed infra", async () => {
  const context = <lootboxTestsArgs>{};

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK != "arbitrum")
      this.skip();

    if (process.env.FLU_DO_LOOTBOX_STAKING_REDEEM_TESTS != "yes") {
      console.log(`FLU_DO_LOOTBOX_STAKING_REDEEM_TESTS is not set to "yes", skipping lootbox staking migration tests!`);
      this.skip();
    }

    const stakingSigner = (await hre.ethers.getSigners())[0];

    context.stakingSigner = stakingSigner;

    const stakingSignerAddress = await stakingSigner.getAddress();

    context.stakingSignerAddress = stakingSignerAddress;

    // the context for the tokens here are set later when the signer is set

    const fusdc = await hre.ethers.getContractAt("Token", USUAL_FUSDC_ADDR);

    const usdc = await hre.ethers.getContractAt("BaseNativeToken", USDC_ADDR);

    const weth = await hre.ethers.getContractAt("TestWETH", WETH_ADDR);

    const lootboxStakingBytecode =
      (await hre.artifacts.readArtifact("LootboxStaking")).deployedBytecode;

    const staking = await hre.ethers.getContractAt(
      "LootboxStaking",
      USUAL_LOOTBOX_STAKING
    );

    context.staking = staking;

    await hre.network.provider.request({
      method: "hardhat_setCode",
      params: [
        USUAL_LOOTBOX_STAKING,
        lootboxStakingBytecode
      ]
    });

    const stakingOperatorAddr = await staking.operator();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [stakingOperatorAddr]
    });

    const stakingOperatorSigner = await hre.ethers.getSigner(stakingOperatorAddr);

    await hre.network.provider.request({
      method: "hardhat_setBalance",
      params: [
        stakingOperatorAddr,
        ethers.constants.MaxUint256.toHexString()
      ]
    });

    try {
      await staking.connect(stakingOperatorSigner).migrateV2();
    } catch (err) {
      console.log(`couldn't migrate deployed staking contract to v2, ${err}`);
    }

    context.camelotRouter = await hre.ethers.getContractAt(
      "TestCamelotRouter",
       CAMELOT_ROUTER
    );

    context.camelotToken1Pair = await hre.ethers.getContractAt(
      "TestCamelotPair",
      CAMELOT_FUSDC_USDC_PAIR
    );

    context.camelotToken2Pair = await hre.ethers.getContractAt(
      "TestCamelotPair",
      CAMELOT_FUSDC_WETH_PAIR
    );

    const sushiswapToken1Pool = await hre.ethers.getContractAt(
      "TestSushiswapPool",
      SUSHISWAP_FUSDC_USDC_POOL
    );

    context.sushiswapToken1Pool = sushiswapToken1Pool.connect(stakingSigner);

    const sushiswapToken2Pool = await hre.ethers.getContractAt(
      "TestSushiswapPool",
      SUSHISWAP_FUSDC_WETH_POOL
    );

    context.sushiswapToken2Pool = sushiswapToken2Pool.connect(stakingSigner);

    const sushiswapTridentRouter = await hre.ethers.getContractAt(
        "TestSushiswapTridentRouter",
        SUSHISWAP_TRIDENT_ROUTER
    );

    context.sushiswapTridentRouter = sushiswapTridentRouter.connect(stakingSigner);

    const sushiswapBentoBox = await hre.ethers.getContractAt(
        "TestSushiswapBentoBox",
        SUSHISWAP_BENTO_BOX
    );

    context.sushiswapBentoBox = sushiswapBentoBox.connect(stakingSigner);

    await hre.network.provider.request({
      method: "hardhat_setBalance",
      params: [
        stakingSignerAddress,
        MaxUint256.toHexString()
      ]
    });

    const spendableEth = MaxUint256.sub(BigNumber.from(10).pow(30));

    await weth.deposit({ value: spendableEth });

    await weth.transfer(stakingSignerAddress, spendableEth);

    expect(await weth.balanceOf(stakingSignerAddress)).to.be.equal(spendableEth);

    // set the usdc holder's balance to the max uint256

    await hre.network.provider.request({
      method: "hardhat_setStorageAt",
      params: [
        USDC_ADDR, // usdc addr
        // balances slot in arb1 usdc
        "0x2cbeea4754db4a62ba37c8dc51b3b78b45db22693f7bbad15c81ebcb017e1ae2",
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" // max uint256
      ]
    });

    expect(await usdc.balanceOf(USDC_HOLDER)).to.be.equal(MaxUint256);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_HOLDER]
    });

    const usdcSigner = await hre.ethers.getSigner(USDC_HOLDER);

    // transfer the usdc holder's balance to the stakingSigner spender

    await usdc.connect(usdcSigner).transfer(stakingSignerAddress, MaxUint256);

    // move some funds into fusdc on the stakingSigner and approve
    // everything else

    const token0 = fusdc.connect(stakingSigner);

    const token1 = usdc.connect(stakingSigner);

    const token2 = weth.connect(stakingSigner);

    context.token0 = token0;

    context.token0Decimals = await token0.decimals();

    context.token1 = token1;

    context.token1Decimals = await token1.decimals();

    context.token2 = token2;

    context.token2Decimals = await token2.decimals();

    await token0.approve(SUSHISWAP_BENTO_BOX, MaxUint256);

    await token1.approve(SUSHISWAP_BENTO_BOX, MaxUint256);

    await token2.approve(SUSHISWAP_BENTO_BOX, MaxUint256);

    await token0.approve(SUSHISWAP_TRIDENT_ROUTER, MaxUint256);

    await token1.approve(SUSHISWAP_TRIDENT_ROUTER, MaxUint256);

    await token2.approve(SUSHISWAP_TRIDENT_ROUTER, MaxUint256);

    await token0.approve(CAMELOT_ROUTER, MaxUint256);

    await token1.approve(CAMELOT_ROUTER, MaxUint256);

    await token2.approve(CAMELOT_ROUTER, MaxUint256);

    await token2.approve(staking.address, MaxUint256);

    await token1.approve(staking.address, MaxUint256);

    await token1.approve(token0.address, MaxUint256);

    // avoiding the supply cap

    await token0.erc20In(BigNumber.from("1000000000000"));

    await token0.approve(staking.address, MaxUint256);
  });

  const maxUint256Hex = MaxUint256.toHexString();

  const redeemAddress = async (staking: ethers.Contract, addr: string) => {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [addr]
    });

    await hre.network.provider.request({
      method: "hardhat_setBalance",
      params: [addr, maxUint256Hex]
    });

    const signer = await hre.ethers.getSigner(addr);

    const deposits = await staking.deposits(addr);

    const [fusdcDeposited, usdcDeposited, wethDeposited] =
      deposits.reduce(([fusdc, usdc, weth]: [BigNumber, BigNumber, BigNumber], deposit: any) => {
        const {
          camelotTokenA,
          camelotTokenB,
          sushiswapTokenA,
          sushiswapTokenB,
          fusdcUsdcPair
        } = deposit;

        const tokenB = camelotTokenB.add(sushiswapTokenB);

        return [
          fusdc.add(camelotTokenA.add(sushiswapTokenA)),
          fusdcUsdcPair ? usdc.add(tokenB) : usdc,
          fusdcUsdcPair ? weth : weth.add(tokenB)
        ];
    }, [Zero, Zero, Zero]);

    expect(fusdcDeposited, addr).to.be.gt(0);

    const { fusdcUsdcRatio, fusdcWethRatio } = await staking.ratios();

    const fees = 100 - 5;

    const [ fusdcRedeemableForUsdc, usdcRedeemable ] = allocateRatio(
      fusdcDeposited.mul(fees).div(100),
      usdcDeposited.mul(fees).div(100),
      fusdcUsdcRatio
    );

    const [ fusdcRedeemableForWeth, wethRedeemable ] = allocateRatio(
      fusdcDeposited.mul(fees).div(100),
      wethDeposited.mul(fees).div(100).mul(BigNumber.from(10).pow(12)),
      fusdcWethRatio
    );

    const { fusdcRedeemed, usdcRedeemed, wethRedeemed } =
      await staking.connect(signer).callStatic.redeem(
        0,
        fusdcRedeemableForUsdc,
        usdcRedeemable,
        wethRedeemable
      );

     // for weth, the number fusdc would be way higher, though it's
     // difficult to test so hopefully this will suffice

    await staking.connect(signer).redeem(
      0,
      fusdcRedeemableForUsdc,
      usdcRedeemable,
      wethRedeemable
    );

    expect(fusdcRedeemed, `fusdc redeemed > 0, for addr ${addr}`).to.be.gt(0);

    if (usdcDeposited.gt(0))
      expect(usdcRedeemed, `usdc redeemed > 0, for addr ${addr}`).to.be.gt(0);

    if (wethDeposited.gt(0))
      expect(wethRedeemed, `weth redeemed > 0, for addr ${addr}`).to.be.gt(0);

    expect(
      fusdcRedeemed, `fusdc redeemable ${fusdcRedeemableForUsdc}, redeemed for addr ${addr}`
    )
      .to.be.gte(fusdcRedeemableForUsdc);

    expect(
      fusdcRedeemed, `fusdc redeemable ${fusdcRedeemableForWeth}, redeemed for addr ${addr}`
    )
      .to.be.gte(fusdcRedeemableForWeth);

    expect(
      usdcRedeemed, `usdc redeemable ${usdcRedeemable}, redeemed for addr ${addr}`
    )
      .to.be.gte(usdcRedeemable);

    expect(
      wethRedeemed, `weth redeemable ${wethRedeemable}, redeemed for addr ${addr}`
    )
      .to.be.gte(wethRedeemable.div(BigNumber.from(10).pow(12)));
  };

  LootboxTests(
    context,
    BigNumber.from(1e6),
    ethers.constants.WeiPerEther
  );

  it("should redeem batch of users #1", async () => {
    const { staking, stakingSigner } = context;

    const addresses = [
      "0x019bef723271d3caa763b0f76292024a155cb57a",
      "0x02e9e647e041854ad3c4c56d8c4f4b69c68a7682",
      "0x0671742a6dfad4e266bd08fc866b666e662c691d",
      "0x06c07cb872cd3a0527df3413afe4de0dac6e080b",
      "0x072d55788e0722c71a426c74a6ca3e52ec0fcd61",
      "0x0882d0bbd4499ae7808cec608e857c22e731ec04",
      "0x096a11f594767e372cc41bc4db94fd9fa3bb4214",
      "0x0983accae22ab0ddef917494dcd18c7abd75785f",
      "0x09fa38eba245bb68354b8950fa2fe71f02863393",
      "0x0a57a71d689098d52c5331e0817dfd62d2b0ee71",
      "0x0acbbae1f057746ca9fb0c25de8fa1cca8927bd2",
      "0x0da045df5429c6494169d39a38da04591da97291",
      "0x0de24bad12c334993b4e8b4e2447dda5f380face",
      "0x0edb39ada48bdf162c09983e0005825c4ce3e5b4",
      "0x0f3922b194fc67e41d60cfe34aa27d791f6a901a",
      "0x10176572ee6c0085e9b014d2eb3105d4ebd9042f",
      "0x1395de9daec52ad405e945603ea0a9346d00d01c",
      "0x16ae99e5d41c14e62932e756a2432419075c0a77",
      "0x1982594f0532e240a50a7b7ffaded7542577873c",
      "0x1a7810e05ad8540e2a298eabf575b8986827ac5a",
      "0x1b4715ddada5903847a4f68fa17ca84a9644d087",
      "0x1c9cbbb90257bf70eb7e97d8865a0cd69b44f683",
      "0x1cd14602425efead850db5b2ecb6f6fb9059e7b6",
      "0x1cd1a6c4570c039368f5456aa82574af6567e6f6",
      "0x1d0239e4e185f5f3fba605897849744ae8b5f333",
      "0x1d7375a6ffc5a60b435558859a2762cfd6c6b07f",
      "0x1e265fdd0654120c739639b87e967f65339aa4cf",
      "0x2013365e851a4c7a5d2cd0a5ac6289bb56fa0252",
      "0x225e02bd307a5af7608ceff02a4e48ba06be4ddd",
      "0x2338e4897119a104a3145f7b500fe98b51a56637",
      "0x2525e15fad6132de12261f2b386bed15b1b929fd",
      "0x2600544f150db80438004be4bbc7114aa21615a9",
      "0x2ae9fcd217cf86093ee94ff539bd4e4f782ef0dd",
      "0x2e8fba7125cfad75b8bc750832b06acae9729b16",
      "0x30070c3be65516b842f03159ec0ecb7e43247dc9",
      "0x33d7147b957c1d1d0bb17d2b09e1d85e86be9873",
      "0x33e0da607a4820d42f48fb71102d9ba68c2f1dca",
      "0x352526e5a98534e4b44cef364170f1c038370ba4",
      "0x38835098a8accd046efa8123f9fcd5aaa2cb3a7e",
      "0x3b174445371dd00fb766357f29118ac6a0aeec1c",
      "0x3d045f52223a9595fb18377b6ca7ac8e220ab35a",
      "0x4060369598c9ceae3178167387a26b885381493e",
      "0x41602b8582f474eb9c029dd502e7dda119345931",
      "0x4325451c4b324bd25f709ddd148ed769d248f467",
      "0x445130702eb79291b597c98386b2e7b6d7bb26b1",
      "0x46c3ebc5b2060abbd44300b725d96994a7c2636d",
      "0x475681f0e12606cf8f97743c1d4558c06a287840",
      "0x49cc14930a9193652d62ad6c64bc74015c308144",
      "0x4b25602812960d9f32ed29afa635144cab835bae",
      "0x4e4b40b1a3f945d6ecc00f65adba063be82439f0",
      "0x4eb3909ad9de01c17b91344aadddff742c2e8cae",
      "0x4f6c81e16d10965ae9a6c33184b88970eba4295c",
      "0x4fdf8672beeb2c6f4d5fae4c09678c5725452f62",
      "0x520cc7572527711b8c50bcefe1d881f8ddb5fe8c",
      "0x52f978e044066b7edb01648a36e333ea0ea66b2b",
      "0x54f58b5fb004512d49cf70b82fced1c076c76509",
      "0x550b8b40a1268bffcd73757ac7b70e29bff79344",
      "0x5672ed55ca88eeac7526b5b40d4d7086c0899e0a",
      "0x5811b5d57cb3f803151768fea0d22046b1ebd65c",
      "0x584313319d0bfead2a9d98a7154f5dcb5a62887f",
      "0x59f6d63e46eb30b986a063e9beb11991eb5caac4",
      "0x5bef45489a03462d199612c5cd992f114f398ea8",
      "0x5d54eb2edeeeffa076294e96080c48e33003f671",
      "0x5d6ddbb7252681c0203e375284f202cf1ede8eee",
      "0x5dcbec257b505f40d454dfee83b747021146d8ed",
      "0x5ddb25070b70268b0f152cad66a637c3fb0222c6",
      "0x600c08e9a9c9b3dd6ecc366e30e3886e3ba75fa7",
      "0x6069a291fc1dbbb0782a1314b6fb06e6d25b22da",
      "0x63aa44d515a7998b0161416eae70daeb6c4adf11",
      "0x64174450c49242535b4184e3988cc4145b80526c",
      "0x66109b3b6348d1df6bf1f8d998e527b967f682ea",
      "0x68cbe93eee39213b5b18aa0d3c8600139d563007",
      "0x6e3e905e8a92e4f8e0e285f760ddabbb12f9a370",
      "0x72bf2dbc9d3a724253a05b58b906109e8c382910",
      "0x73de6726d7d860cc8fbbf7efc1463e6bd25d8661",
      "0x7852d40f2a8ea6c219a91aea2249f5a3f70d4da0",
      "0x78d83e0e3ef91c665f3af70833c13c0fa986ed63",
      "0x7946b91ce73bad150a1543432f8e56fb3c3692cc",
      "0x7a08eaa93c05abd6b86bb09b0f565d6fc499ee35",
      "0x7dd7c3366c8415c5cef494b707c45cc1e3b57e9e",
      "0x7e4f44bd35ffa7a03caacc03604911a6a7aa42b2",
      "0x7f64716cfb04ef0b78a3fcf02d3406a1b9dd0c42",
      "0x803bc0dc45657fc9018c8be9b0e4da9d77d9f9bc",
      "0x8102320056e5b61e4031bff9d1907145c11d05a5",
      "0x81d53cd3e96fd8d51cef3de47e546d0b325af8bf",
      "0x81ea9fe692a2c4e86ad1079b6c6018b83dd65cfe",
      "0x85687cc0a149e77227fcba1269a1dd4055f38010",
      "0x8a36c41e2b7d0ee24668729d08543ab77a99dced"
    ];

    await advanceTime(hre, "999999999");

    await sendEmptyTransaction(stakingSigner);

    const redemptions = addresses.map((addr) => redeemAddress(staking, addr));

    await Promise.all(redemptions);
  });

  it("should redeem batch of users #2", async () => {
    const { staking, stakingSigner } = context;

    const addresses = [
      "0x8bc493dfdf7820facfc68c251b26bd7a888dd39e",
      "0x8cb187fa7139a1aba9764f97e10521eec260a6ec",
      "0x8cb300ebb3028c15ab69c3e9cdff1be60aaa43a2",
      "0x90f15e09b8fb5bc080b968170c638920db3a3446",
      "0x925c4798df848fa2bf11f44c97d36c38c19560f4",
      "0x944b701d3661638ea34723bef96c618a98c017f2",
      "0x94d4d40759af1cd2addb95252278dbae38c78d1b",
      "0x9610d5a6796358de51691d2803efdd818f3e7557",
      "0x9b25235ee2e5564f50810e03ea5f91976a8ee6fa",
      "0x9debadcaae4820092c8ff7dc741c9ec7d9e95027",
      "0xa07c60b149b44883bca0cb4de6e2d26eae016649",
      "0xa129d5436fb797ff1d9c11b5f9d3ab0e27dd34b5",
      "0xa2b430fffa485250ddd20a81b609f507728b4ccf",
      "0xa3728c1f3ac52ded2fc69d3b95235d7a6fd2b377",
      "0xa770a33cbf2e97a0eaed41afabddb997661cc24a",
      "0xa8a163596130be5ad70b4202a02bb984e187e795",
      "0xab7b49bacd43bd4cfa41433d477f690bb9e1fb26",
      "0xab888291f4127352b655fd476f64ac2ebfb8fe76",
      "0xb14130755bdc32f3540b8ff1ab417304c80d0eef",
      "0xb2a11f839e3438391341555ed6982627d32805ca",
      "0xb4d50b4e31181a004beb14e8b0a522bb434ea1fe",
      "0xb607b3e6554d248c55f98a368a25629a22ce38ea",
      "0xb8b0cc3793bbbfdb997fec45828f172e5423d3e2",
      "0xbafaf28d01aefec4cf16830d2187becd502c6e0f",
      "0xbbdfe37f2b5d2b7e86721324336abdc2221c4be3",
      "0xbc9cc214cee3c7a678177682a28719011f245bfb",
      "0xbca4d68be543dcefb1a8bccb519503f9ba3f2026",
      "0xbed050c15224a53a12815fa79f2b1ef431887eb2",
      "0xc02836da7e0183bac6d08ca1bd9d7fdc2e031634",
      "0xc18cf3fce9d397d9094c34a94b8dc668212b7c08",
      "0xc34ae1a39662415a4720d4a3e7c2be0e202568c2",
      "0xc5011d65d107bfdfe7ea1e137bed79c74c3f6cf9",
      "0xc6e8ff2b228fd347499faa91a1cce4a7707b8d0e",
      "0xc7307fd7fc10bd5da7abb99172b64b040d89fdea",
      "0xc9ac69013f041ebee6009bed69047db1a795dbe9",
      "0xcafd650401708ca4f65a22340d07f78e18f8c332",
      "0xcb53a818042db647cb01672751b0e4efca29cf55",
      "0xcdfa50551cecac35d4b8580c58b9bf8bac643cda",
      "0xcf4ef2ed078f7115ca0dd4bc9294d97e774ec38a",
      "0xcf9cbecbee74e3de9acd68cbca714dacdfa6b795",
      "0xd3fc67a0c171db1b72ddb6037e84755c1670e996",
      "0xd57e9df75381553ce9c154712ac7f73eb206bd63",
      "0xd74a6c32d9b8fe2c33f0b0b00e80511ed78f75ea",
      "0xd810dcae451c1ac28fd0f3ddfbe3e6c9c12d3df9",
      "0xd8f3676a7567842295170b3f6ae4bd466a878374",
      "0xdc7ec05bf7781f9e861ee5486023dc6cf71fa7c4",
      "0xe0b7169944321fadb6acc7d1aa97d7c28e66db9b",
      "0xe1690f5153ad0bbc683964aa81645c49b3cf6567",
      "0xe1f5e7b5370e5452fd674975fee63e52de283545",
      "0xe274ae86ff13c1bbaacd3662ec5fd7279a18e28f",
      "0xe457fe9ca7a67125189697b2978cdadd8bc8c0b5",
      "0xe874411d6e354b93be52b05280052c193550fa03",
      "0xe8fcdb117a5f0ec16ef040e6fe3f675390a7bb5c",
      "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5",
      "0xecc408d6248ec82167fbf395da8c801cb0a2a73b",
      "0xedc7230464ad30723b9b9640cd142b75bee2fd20",
      "0xee33d688fe27a3a754435c50f8a12654d5327a16",
      "0xf33fd427e695b63c81f238b5d8ea75aea31d15a4",
      "0xf45b34c93ada2a18bf03fa6dd3904ab9f6df273d",
      "0xf574fbbbd0c29ff2dbd10839e33793a6eafde809",
      "0xf5fe364d18f4a5a53badce9a046ba74cfc97f6fb",
      "0xf7f44de9a2a18a718c24f0636bd99bf8994f9b1d",
      "0xf9039ae1e299486d8e6c5740ca6340797fd42736",
      "0xf93aaaec5e4ced8605a57b3dff011ec408a8ebdb",
      "0xf9f41c487fd784e0cf7522206a2aeb4fe7b34b9c",
      "0xfb408fa20c6f6da099a7492107bc3531911896e3",
      "0xfc2d8c756334a6f0b597b71fcfd81964cc327160",
      "0xfc5dec71d37c07a1567fcf2f966bca67f16e9924",
      "0xfd6972254906c2ccd4c325f67dcc1a2ebc80652b",
      "0xfd7d9173403efd29f6b0b576217a59fd426170b8"
    ];


    await advanceTime(hre, "999999999");

    await sendEmptyTransaction(stakingSigner);

    const redemptions = addresses.map((addr) => redeemAddress(staking, addr));

    await Promise.all(redemptions);
  });
});
