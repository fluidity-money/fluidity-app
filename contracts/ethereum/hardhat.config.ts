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
  USDT_HOLDER, USDC_HOLDER, DAI_HOLDER, TUSD_HOLDER, FEI_HOLDER,
} from './test-constants';

import { ethers } from "ethers";

const IERC20Path =
  './artifacts/contracts/openzeppelin/IERC20.sol/IERC20.json';

const oracleKey = `FLU_ETHEREUM_ORACLE_ADDRESS`;

const oracleAddress = process.env[oracleKey];

const errorQuitNotSet = (environmentVariable: string) => {
  console.error(`${environmentVariable} not set!`);
  process.exit(1);
};

if (oracleAddress == "") errorQuitNotSet(oracleKey);

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
  if (!shouldDeploy.length) return;

  if (!oracleAddress)
    throw new Error(
      `Set env variable ${oracleKey} to an 0x123 encoded public key.`);

  await hre.run("forknet:take-usdt");

  const tokenFactory = await hre.ethers.getContractFactory("Token");
  const compoundFactory = await hre.ethers.getContractFactory("CompoundLiquidityProvider");
  const aaveFactory = await hre.ethers.getContractFactory("AaveLiquidityProvider");

  const tokenBeacon = await hre.upgrades.deployBeacon(tokenFactory);
  const compoundBeacon = await hre.upgrades.deployBeacon(compoundFactory);
  const aaveBeacon = await hre.upgrades.deployBeacon(aaveFactory);

  const deployTokens = async <T extends keyof typeof TokenList>(tokenNames: T[]) => {
    const tokens = tokenNames.map(t => TokenList[t])

    for (const token of tokens) {
      console.log(`deploying ${token.name}`);

      var deployedPool: ethers.Contract
      const deployedToken = await hre.upgrades.deployBeaconProxy(
        tokenBeacon,
        tokenFactory,
      );

      switch (token.backend) {
        case 'compound':
          deployedPool = await hre.upgrades.deployBeaconProxy(
            compoundBeacon,
            compoundFactory,
            [token.compoundAddress, deployedToken.address],
          );

          break;

        case 'aave':
          deployedPool = await hre.upgrades.deployBeaconProxy(
            aaveBeacon,
            aaveFactory,
            [AAVE_POOL_PROVIDER_ADDR, token.aaveAddress, deployedToken.address],
          );

          break;

        default:
          assertNever(token);

      }

      await deployedPool.deployed();
      await deployedToken.deployed();
      await deployedToken.functions.init(
        deployedPool.address,
        token.decimals,
        token.name,
        token.symbol,
        oracleAddress,
      );

      console.log(`deployed ${token.name} to ${deployedToken.address}`);
    }
  };

  await deployTokens(shouldDeploy);
});

subtask("forknet:take-usdt", async (_taskArgs, hre) => {
  const IERC20 =
    await readFile(IERC20Path)
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
      accounts: [process.env.FLU_ETHEREUM_DEPLOY_ROPSTEN_KEY],
      url: process.env.FLU_ETHEREUM_DEPLOY_ROPSTEN_URL,
      gas: 9000000
    },
    kovan: {
      accounts: [process.env.FLU_ETHEREUM_DEPLOY_KOVAN_KEY],
      url: process.env.FLU_ETHEREUM_DEPLOY_KOVAN_URL
    }
  }
};
