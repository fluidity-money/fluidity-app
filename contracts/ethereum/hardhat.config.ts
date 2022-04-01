import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import { task, subtask } from "hardhat/config";
import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";
import { promisify } from "util";
import { readFile as readFileCB } from 'fs';
const readFile = promisify(readFileCB);

import {
  AAVE_POOL_PROVIDER_ADDR,

  USDT_ADDR, USDC_ADDR, DAI_ADDR, TUSD_ADDR, FEI_ADDR,
  CUSDT_ADDR, CUSDC_ADDR, CDAI_ADDR, CTUSD_ADDR, AFEI_ADDR,
  FRAX_ADDR, AFRAX_ADDR,

  USDT_HOLDER, USDC_HOLDER, DAI_HOLDER, TUSD_HOLDER, FEI_HOLDER,
  FRAX_HOLDER
} from './test-constants';

import { ethers } from "ethers";

const IERC20UpgradeablePath =
  './artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol/IERC20Upgradeable.json';

const oracleKey = `FLU_ETHEREUM_ORACLE_ADDRESS`;

const oracleAddress = process.env[oracleKey];

if (oracleAddress == "") {
  console.error("FLU_ETHEREUM_ORACLE_ADDRESS is not set!");
  process.exit(1);
};

type Token = {
  decimals: number,
  name: string,
  symbol: string,
  address: string,
  owner: string
} & (
    {
      backend: 'compound',
      compoundAddress: string
    } | {
      backend: 'aave',
      aaveAddress: string
    }
  );

const TokenList: { [name: string]: Token } = {
  "usdt": {
    backend: 'compound',
    compoundAddress: CUSDT_ADDR,
    decimals: 6,
    name: "Fluid USDt",
    symbol: "fUSDt",
    address: USDT_ADDR,
    owner: USDT_HOLDER
  },
  "usdc": {
    backend: 'compound',
    compoundAddress: CUSDC_ADDR,
    decimals: 6,
    name: "Fluid USDc",
    symbol: "fUSDc",
    address: USDC_ADDR,
    owner: USDC_HOLDER
  },
  "dai": {
    backend: 'compound',
    compoundAddress: CDAI_ADDR,
    decimals: 18,
    name: "Fluid DAI",
    symbol: "fDAI",
    address: DAI_ADDR,
    owner: DAI_HOLDER
  },
  "tusd": {
    backend: 'compound',
    compoundAddress: CTUSD_ADDR,
    decimals: 18,
    name: "Fluid tUSD",
    symbol: "ftUSD",
    address: TUSD_ADDR,
    owner: TUSD_HOLDER
  },
  "fei": {
    backend: 'aave',
    aaveAddress: AFEI_ADDR,
    decimals: 18,
    name: "Fluid Fei",
    symbol: "fFei",
    address: FEI_ADDR,
    owner: FEI_HOLDER
  },
  "frax": {
    backend: 'aave',
    aaveAddress: AFRAX_ADDR,
    decimals: 18,
    name: "Fluid Frax",
    symbol: "fFRAX",
    address: FRAX_ADDR,
    owner: FRAX_HOLDER
  }
};

let shouldDeploy: (keyof typeof TokenList)[] = [];

task("deploy-forknet", "Starts a node on forked mainnet with the contracts initialized")
  .addOptionalParam("tokens", "the tokens to deploy")
  .setAction(async (args, hre) => {
    shouldDeploy = args.tokens?.split(',') || Object.keys(TokenList);

    for (const t of shouldDeploy)
      if (!TokenList.hasOwnProperty(t)) {
        const validTokens = Object.keys(TokenList).join(',');
        throw new Error(`unknown token ${t} - valid tokens are ${validTokens}`);
      }

    await hre.run("node", { ...{ network: 'hardhat' } });
  });

subtask(TASK_NODE_SERVER_READY, async (_taskArgs, hre) => {
  if (!shouldDeploy) return;

  if (!oracleAddress)
    throw new Error(
      `Set env variable ${oracleKey} to an 0x123 encoded public key.`);

  await hre.run("forknet:take-usdt");

  const factoryCompound = await hre.ethers.getContractFactory("TokenCompound");
  const factoryAave = await hre.ethers.getContractFactory("TokenAave");

  const deployTokens = async <T extends keyof typeof TokenList>(tokenNames: T[]) => {
    const tokens = tokenNames.map(t => TokenList[t])

    for (const token of tokens) {
      console.log(`deploying ${token.name}`);

      var deployedToken: ethers.Contract;

      switch (token.backend) {
        case 'compound':
          deployedToken = await hre.upgrades.deployProxy(
            factoryCompound,
            [
              token.compoundAddress,
              token.decimals,
              token.name,
              token.symbol,
              oracleAddress
            ]
          );

          break;

        case 'aave':
          deployedToken = await hre.upgrades.deployProxy(
            factoryAave,
            [
              token.aaveAddress,
              AAVE_POOL_PROVIDER_ADDR,
              token.decimals, token.name, token.symbol, oracleAddress
            ]
          );

          break;

        default:
          assertNever(token);

      }

      await deployedToken.deployed();

      console.log(`deployed ${token.name} to ${deployedToken.address}`);
    }
  };

  await deployTokens(shouldDeploy);
});

subtask("forknet:take-usdt", async (_taskArgs, hre) => {
  const IERC20 =
    await readFile(IERC20UpgradeablePath)
      .then(res => JSON.parse('' + res))
      .catch(e => {
        if (e.code === "ENOENT")
          throw new Error(
            `Contract artifacts not found - have you run \`npx hardhat compile\`?`);

        throw e;
      });

  const accounts = (await hre.ethers.getSigners()).slice(0, 10);

  const takeERC20 = async <T extends keyof typeof TokenList>(tokenNames: T[]) => {
    const tokens = tokenNames.map(t => TokenList[t]);

    for (const token of tokens) {

      console.log(`taking ${token.name}`);

      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [token.owner],
      });

      const impersonatedToken = new hre.ethers.Contract(
        token.address,
        IERC20.abi,
        await hre.ethers.getSigner(token.owner),
      );

      const initialUsdtBalance: ethers.BigNumber =
        await impersonatedToken.balanceOf(token.owner);

      const initialUsdtBalanceString = initialUsdtBalance.toString();

      console.log(
        `token holder for ${token.name} has balance ${initialUsdtBalanceString}`);

      const amount = initialUsdtBalance.div(accounts.length);

      const promises = accounts.map(async address => {
        await impersonatedToken.transfer(address.address, amount);

        if (!(await impersonatedToken.balanceOf(address.address)).eq(amount))
          throw new Error(`failed to take token ${token.name} ${token.address}`);
      });

      await Promise.all(promises);

      await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [token.owner],
      });

      console.log(`finished taking ${token.name}`);
    }
  };

  await takeERC20(shouldDeploy);
});

// statically ensure an object can't exist (ie, all enum varients are handled)
function assertNever(_: never): never { throw new Error(`assertNever called: ${arguments}`); }
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
