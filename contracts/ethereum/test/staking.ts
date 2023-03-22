
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
    if (process.env.FLU_FORKNET_NETWORK != "arbitrum") {
      this.skip();
    }

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
      100000
    );

    token1 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 1",
      18,
      100000
    );

    token2 = await erc20TokenFactory.connect(stakingSigner).deploy(
      "Staking test token",
      "token 2",
      18,
      100000
    );

    const transparentUpgradeableProxyFactory = await hre.ethers.getContractFactory(
      "TransparentUpgradeableProxy"
    );

    const saddleSwapFactory = await hre.ethers.getContractFactory("ISaddleSwap");

    const proxyAdminAddress = await proxySigner.getAddress();

    saddleSwapToken0Token1 = await transparentUpgradeableProxyFactory.deploy(
      SADDLE_SWAP_IMPL,
      proxyAdminAddress,
      saddleSwapFactory.interface.encodeFunctionData("initialize", [
        [token0.address, token1.address],
        [18, 18],
        "swag",
        "yolo",
        100, // a
        4000000, // swap fee pulled from 0x1adf4abc3be3c6988a5cd9eb4eab1a1048c13e4d16e382a65f3327b4e904f8f9
        0, // admin fee
        4000000 // withdrawal fee
      ])
    );

    await saddleSwapToken0Token1.deployed();

    saddleSwapToken0Token2 = await transparentUpgradeableProxyFactory.deploy(
      SADDLE_SWAP_IMPL,
      proxyAdminAddress,
      saddleSwapFactory.interface.encodeFunctionData("initialize", [
        [token0.address, token2.address],
        [18, 18],
        "swag",
        "yolo",
        100, // a
        4000000, // swap fee pulled from 0x1adf4abc3be3c6988a5cd9eb4eab1a1048c13e4d16e382a65f3327b4e904f8f9
        0, // admin fee
        4000000 // withdrawal fee
      ])
    );

    await saddleSwapToken0Token2.deployed();

    const sushiswapFactory = await hre.ethers.getContractAt(
      "IUniswapV2Factory",
      SUSHISWAP_FACTORY
    );

    sushiswapRouter = await hre.ethers.getContractAt(
      "IUniswapV2Router02",
      SUSHISWAP_ROUTER
    );

    await sushiswapFactory.createPair(token0.address, token1.address);

    await sushiswapFactory.createPair(token0.address, token2.address);

    const camelotFactory = await hre.ethers.getContractAt(
      "IUniswapV2Factory",
      CAMELOT_FACTORY
    );

    camelotRouter = await hre.ethers.getContractAt(
      "IUniswapV2Router02",
      CAMELOT_ROUTER
    );

    await camelotFactory.createPair(token0.address, token1.address);

    await camelotFactory.createPair(token0.address, token2.address);

    staking = await stakingFactory.deploy();

    await staking.init(
      token0.address,
      token1.address,
      token2.address,
      saddleSwapToken0Token1,
      saddleSwapToken0Token2,
      SUSHISWAP_ROUTER,
      CAMELOT_ROUTER
    );
  });

  it("should lock up 100 test token 1 and test token 2", async() => {

  });
});
