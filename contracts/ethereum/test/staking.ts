
// these tests are only available on arbitrum

import * as hre from "hardhat";

import { ethers } from "ethers";

import {
  SUSHISWAP_FACTORY,
  SUSHISWAP_ROUTER,
  CAMELOT_FACTORY,
  CAMELOT_ROUTER,
  SADDLE_SWAP_IMPL } from "./arbitrum-constants";

import { signers, commonFactories } from "./setup-common";

// TODO randomise for each token
const tokenAmount = 100000;

describe("Staking", async () => {
  let stakingSigner: ethers.Signer;

  let proxySigner: ethers.Signer;

  let erc20TokenFactory: ethers.ContractFactory;

  let token0: ethers.Contract;

  let token1: ethers.Contract;

  let token2: ethers.Contract;

  let sushiswapRouter: ethers.Contract;

  let staking: ethers.Contract;

  let saddleSwapToken0Token1: ethers.Contract;

  let saddleSwapToken0Token2: ethers.Contract;

  let camelotRouter: ethers.Contract;

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK != "arbitrum")
      this.skip();

    ({
      userAccount1: stakingSigner,
      userAccount2: proxySigner
    } = signers);

    erc20TokenFactory = commonFactories.govToken;

    const stakingFactory = commonFactories.staking;

    token0 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 0",
      18,
      tokenAmount
    );

    console.log(`token 0: ${token0.address}`);

    token1 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 1",
      18,
      tokenAmount
    );

    console.log(`token 1: ${token1.address}`);

    token2 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 2",
      18,
      tokenAmount
    );

    console.log(`token 2: ${token2.address}`);

    const transparentUpgradeableProxyFactory = await hre.ethers.getContractFactory(
      "TransparentUpgradeableProxy"
    );

    const saddleSwapInterface = new ethers.utils.Interface([`
      function initialize(
        address[] pooledTokens,
        uint8[] decimals,
        string lpTokenName,
        string lpTokenSymbol,
        uint256 a,
        uint256 fee,
        uint256 adminFee,
        uint256 withdrawFee
      )
    `]);

    const proxyAdminAddress = await proxySigner.getAddress();

    saddleSwapToken0Token1 = await transparentUpgradeableProxyFactory.deploy(
      SADDLE_SWAP_IMPL,
      proxyAdminAddress,
      saddleSwapInterface.encodeFunctionData("initialize", [
        [token0.address, token1.address], // pooledTokens
        [18, 18], // decimals
        "swag", // lpTokenName
        "yolo", // lpTokenSymbol
        100, // a
        4000000, // fee, swap fee pulled from 0x1adf4abc3be3c6988a5cd9eb4eab1a1048c13e4d16e382a65f3327b4e904f8f9
        0, // admin fee
        4000000 // withdrawal fee
      ])
    );

    console.log(`saddle swap token 0 token 1: ${saddleSwapToken0Token1.address}`);

    saddleSwapToken0Token2 = await transparentUpgradeableProxyFactory.deploy(
      SADDLE_SWAP_IMPL,
      proxyAdminAddress,
      saddleSwapInterface.encodeFunctionData("initialize", [
        [token0.address, token2.address], // pooledTokens
        [18, 18], // decimals
        "swag", // lpTokenName
        "yolo", // lpTokenSymbol
        100, // a
        4000000, // fee, swap fee pulled from 0x1adf4abc3be3c6988a5cd9eb4eab1a1048c13e4d16e382a65f3327b4e904f8f9
        0, // admin fee
        4000000 // withdrawal fee
      ])
    );

    console.log(`saddle swap token 0 token 2: ${saddleSwapToken0Token2.address}`);

    console.log(`saddle swap token 0 token 2 impl: ${SADDLE_SWAP_IMPL}`);

    const sushiswapFactory = await hre.ethers.getContractAt(
      "TestUniswapV2Factory",
      SUSHISWAP_FACTORY
    );

    sushiswapRouter = await hre.ethers.getContractAt(
      "TestUniswapV2Router",
      SUSHISWAP_ROUTER
    );

    await sushiswapFactory.createPair(token0.address, token1.address);

    await sushiswapFactory.createPair(token0.address, token2.address);

    const camelotFactory = await hre.ethers.getContractAt(
      "TestUniswapV2Factory",
      CAMELOT_FACTORY
    );

    camelotRouter = await hre.ethers.getContractAt(
      "TestUniswapV2Router",
      CAMELOT_ROUTER
    );

    await camelotFactory.createPair(token0.address, token1.address);

    await camelotFactory.createPair(token0.address, token2.address);

    staking = await stakingFactory.connect(stakingSigner).deploy();

    console.log(`staking signer: ${await stakingSigner.getAddress()}`);

    await staking.connect(stakingSigner).init(
      token0.address,
      token1.address,
      token2.address,
      saddleSwapToken0Token1.address,
      saddleSwapToken0Token2.address,
      camelotRouter.address,
      sushiswapRouter.address
    );

    console.log(`staking address: ${staking.address}`);

    await token0.approve(staking.address, tokenAmount);
    await token1.approve(staking.address, tokenAmount);
    await token2.approve(staking.address, tokenAmount);
  });

  it("should lock up 100 test token 1 and test token 2", async() => {
    await staking.connect(stakingSigner).deposit(8640000, tokenAmount, tokenAmount, 0);
  });
});
