import { expect } from "chai";
import { ethers } from "hardhat";
import * as hre from "hardhat";
import { promisify } from "util";
import { readFile as readFileCB } from "fs";
const readFile = promisify(readFileCB);
import { USDT_ADDR, CUSDT_ADDR } from "../test-constants";

describe("token compound integration", async function () {
  let testAccount: string;
  let usdt: InstanceType<typeof ethers.Contract>;
  let token: InstanceType<typeof ethers.Contract>;

  before(async function () {
    const IERC20 = await readFile('./artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol/IERC20Upgradeable.json')
      .then(res => JSON.parse('' + res))
    const accounts = await ethers.getSigners();
    const testSigner = accounts[0];
    testAccount = accounts[0].address;

    // now connect to the contracts with our real account
    usdt = new ethers.Contract(USDT_ADDR, IERC20.abi, testSigner);

    const Token = await ethers.getContractFactory("TokenCompound");
    token = await Token.deploy();
    await token.deployed();
    await token.initialize(CUSDT_ADDR, 6, "Fluid USDt", "fUDSt", "0x0000000000000000000000000000000000000000");
  });

  it("should allow depositing erc20 tokens", async function () {
    const originalUSDtBalance = (await usdt.balanceOf(testAccount)).toNumber();

    await usdt.approve(token.address, 100000);
    await token.erc20In(123);

    // we have 123 fUSDt
    expect((await token.balanceOf(testAccount)).toNumber()).to.equal(123);

    // there's at least 123 usdt in the fluidity pool
    expect((await token.totalSupply()).toNumber()).to.equal(123);

    // we've lost 123 USDt
    expect((await usdt.balanceOf(testAccount)).toNumber()).to.equal(originalUSDtBalance - 123);

    // fluidity's invested the USDt
    expect((await usdt.balanceOf(token.address)).toNumber()).to.equal(0);
  });
  it("should allow withdrawing erc20 tokens", async function () {
    await usdt.approve(token.address, 0);
    await usdt.approve(token.address, 100000);
    await token.erc20In(123);

    const originalfUSDtBalance = (await token.balanceOf(testAccount)).toNumber();
    const originalPoolAmount = (await token.totalSupply()).toNumber();

    await token.erc20Out(100);
    expect((await token.balanceOf(testAccount)).toNumber()).to.equal(originalfUSDtBalance - 100);
    expect((await token.totalSupply()).toNumber()).to.equal(originalPoolAmount - 100);
  });

  it("should accrue interest", async function () {
    await usdt.approve(token.address, 0);
    await usdt.approve(token.address, 10 ** 12);
    // invest 10k usdt
    await token.erc20In(10 ** 10);

    const initialPoolAmount = ethers.BigNumber.from(0);
    for (let i = 0; i < 100; i++) {
      await hre.network.provider.send("evm_mine");
    }
    const finalPoolAmount = await token.callStatic.rewardPoolAmount();
    expect(finalPoolAmount.toNumber() > initialPoolAmount.toNumber()).to.equal(true);
    console.log(`compound earned ${finalPoolAmount.toNumber() - initialPoolAmount.toNumber()} interest over 100 blocks`);
  });
});
