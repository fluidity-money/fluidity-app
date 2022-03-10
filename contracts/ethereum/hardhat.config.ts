import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import { task, subtask } from "hardhat/config";
import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";
import { promisify } from "util";
import { readFile as readFileCB } from 'fs';
const readFile = promisify(readFileCB);

import {
  USDT_ADDR,
  CUSDT_ADDR,
  USDT_HOLDER,
  USDC_ADDR,
  CUSDC_ADDR,
  USDC_HOLDER,
  DAI_ADDR,
  CDAI_ADDR,
  TUSD_ADDR,
  CTUSD_ADDR,
  TUSD_HOLDER,
  DAI_HOLDER } from './test-constants';

import {HttpNetworkConfig} from "hardhat/types";
import { ethers } from "ethers";

const oracleKey = `FLU_ETHEREUM_ORACLE_ADDRESS`;
const oracleAddress = process.env[oracleKey];

let shouldDeploy = false;
task("deploy-forknet", "Starts a node on forked mainnet with the contracts initialized", async (_taskArgs, hre) => {
  shouldDeploy = true;
  await hre.run("node", {...{network: 'hardhat'}});
});


if (oracleAddress == "") {
  console.error("FLU_ETHEREUM_ORACLE_ADDRESS is not set!");
  process.exit(1);
};

subtask(TASK_NODE_SERVER_READY, async (_taskArgs, hre) => {
  if (shouldDeploy) {
    if (!oracleAddress) throw new Error(`Set env variable ${oracleKey} to an 0x123 encoded public key.`);

    await hre.run("forknet:take-usdt");

    const factory = await hre.ethers.getContractFactory("TokenCompound");

    const deployTokens = async (tokens: {compoundAddress: string, decimals: number, name: string, symbol: string, oracle: string}[]) => {
      for (const token of tokens) {
        console.log(`deploying ${token.name}`);
        const deployedToken = await hre.upgrades.deployProxy(
          factory,
          [token.compoundAddress, token.decimals, token.name, token.symbol, token.oracle],
        );
        await deployedToken.deployed();
        console.log(`deployed ${token.name} to ${deployedToken.address}`);
      }
    };

    await deployTokens([
      {compoundAddress: CUSDT_ADDR, decimals: 6, name: "Fluid USDt", symbol: "fUSDt", oracle: oracleAddress},
      {compoundAddress: CUSDC_ADDR, decimals: 6, name: "Fluid USDc", symbol: "fUSDc", oracle: oracleAddress},
      {compoundAddress: CDAI_ADDR, decimals: 18, name: "Fluid DAI", symbol: "fDAI", oracle: oracleAddress},
      {compoundAddress: CTUSD_ADDR, decimals: 18, name: "Fluid tUSD", symbol: "ftUSD", oracle: oracleAddress},
    ]);
  }
});

subtask("forknet:take-usdt", async (_taskArgs, hre) => {
  const IERC20 = await readFile('./artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol/IERC20Upgradeable.json')
    .then(res => JSON.parse('' + res))
    .catch(e => {
      if (e.code === "ENOENT") throw new Error(`Contract artifacts not found - have you run \`npx hardhat compile\`?`);
      throw e;
    });

  const accounts = (await hre.ethers.getSigners()).slice(0,10);

  const takeERC20 = async (tokens: {name: string, owner: string, address: string}[]) => {
    for (const token of tokens) {
      console.log(`taking ${token.name}`)
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [token.owner],
      });

      const impersonatedToken = new hre.ethers.Contract(
        token.address,
        IERC20.abi,
        await hre.ethers.getSigner(token.owner),
      );

      const initialUsdtBalance: ethers.BigNumber = await impersonatedToken.balanceOf(token.owner);
      console.log(`token holder for ${token.name} has balance ${initialUsdtBalance.toString()}`)
      const amount = initialUsdtBalance.div(accounts.length);

      const promises = accounts.map(async address => {
        await impersonatedToken.transfer(address.address, amount);
        if (!(await impersonatedToken.balanceOf(address.address)).eq(amount)) throw new Error(`failed to take token ${token.name} ${token.address}`);
      })
      await Promise.all(promises);

      await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [token.owner],
      });

      console.log(`finished taking ${token.name}`);
    }
  };

  await takeERC20([
    { name: "USDt", address: USDT_ADDR, owner: USDT_HOLDER },
    { name: "USDc", address: USDC_ADDR, owner: USDC_HOLDER },
    { name: "DAI", address: DAI_ADDR, owner: DAI_HOLDER },
    { name: "tUSD", address: TUSD_ADDR, owner: TUSD_HOLDER },
  ]);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.11",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      timeout: 100000,
    },
    hardhat: {
      accounts: {
        mnemonic: "fluid fluid fluid fluid fluid fluid fluid fluid fluid fluid fluid jump",
      },
      //mining: {
        //cauto: false,
        //interval: 0,
      //},
      //loggingEnabled: true,
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/JfzgyHq6sTI5Zup6pgi13HSfc3vTlXbA",
        blockNumber: 14098095,
      },
    },
    ropsten: {
      accounts: ['60a8a6cf18ecf8978f1b87863adb3db802d1033419594215a741a32f90051f63'],
      url: "https://ropsten.infura.io/v3/d1ac3dc1af2649908a69582ffa1a424d",
      gas: 9000000
    },
  }
};
