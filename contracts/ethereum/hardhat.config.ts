import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-docgen";
import { task, subtask } from "hardhat/config";
import type { HardhatUserConfig } from "hardhat/types";
import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";
import { deployTokens, forknetTakeFunds, mustEnv } from './script-utils';

import { AAVE_POOL_PROVIDER_ADDR, TokenList } from './test-constants';

const oracleKey = `FLU_ETHEREUM_ORACLE_ADDRESS`;

let oracleAddress: string;

let shouldDeploy: (keyof typeof TokenList)[] = [];

task("deploy-forknet", "Starts a node on forked mainnet with the contracts initialized")
  .addOptionalParam("tokens", "the tokens to deploy")
  .setAction(async (args, hre) => {
    oracleAddress = mustEnv(oracleKey);
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

  await deployTokens(
    hre,
    shouldDeploy.map(token => TokenList[token]),
    AAVE_POOL_PROVIDER_ADDR,
    oracleAddress,
  );
  console.log(`deployment complete`);
});

subtask("forknet:take-usdt", async (_taskArgs, hre) => {
  const accounts = (await hre.ethers.getSigners()).slice(0, 10);

  await forknetTakeFunds(
    hre,
    accounts,
    shouldDeploy.map(token => TokenList[token]),
  );
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const networks: HardhatUserConfig['networks'] = {};

if (process.env.FLU_ETHEREUM_DEPLOY_ROPSTEN_KEY) {
  networks['ropsten'] = {
    accounts: [process.env.FLU_ETHEREUM_DEPLOY_ROPSTEN_KEY],
    url: process.env.FLU_ETHEREUM_DEPLOY_ROPSTEN_URL,
    gas: 9000000
  };
}

if (process.env.FLU_ETHEREUM_DEPLOY_KOVAN_KEY) {
  networks['kovan'] = {
    accounts: [process.env.FLU_ETHEREUM_DEPLOY_KOVAN_KEY],
    url: process.env.FLU_ETHEREUM_DEPLOY_KOVAN_URL
  };
}

if (process.env.FLU_ETHEREUM_DEPLOY_AURORA_MAINNET_KEY) {
  networks['aurora'] = {
      accounts: [process.env.FLU_ETHEREUM_DEPLOY_AURORA_MAINNET_KEY],
      url: process.env.FLU_ETHEREUM_DEPLOY_AURORA_MAINNET_URL,
    }
}

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
    ...networks,
  },
  docgen: {
    except: [`Interface`, `openzeppelin`],
  }
};
