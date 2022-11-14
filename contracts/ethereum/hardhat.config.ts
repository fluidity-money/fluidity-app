import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-docgen";
import { task, subtask } from "hardhat/config";
import type { HardhatUserConfig } from "hardhat/types";
import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";
import { deployTokens, deployWorkerConfig, forknetTakeFunds, mustEnv } from './script-utils';

import { AAVE_V2_POOL_PROVIDER_ADDR, TokenList } from './test-constants';

const oracleKey = `FLU_ETHEREUM_ORACLE_ADDRESS`;

const emergencyCouncilKey = `FLU_ETHEREUM_EMERGENCY_COUNCIL_ADDRESS`;

const operatorKey = `FLU_ETHEREUM_OPERATOR_ADDRESS`;

let oracleAddress: string;

let emergencyCouncilAddress: string;

let operatorAddress: string;

let shouldDeploy: (keyof typeof TokenList)[] = [];

task("deploy-forknet", "Starts a node on forked mainnet with the contracts initialized")
  .addOptionalParam("tokens", "the tokens to deploy")
  .setAction(async (args, hre) => {
    oracleAddress = mustEnv(oracleKey);
    emergencyCouncilAddress = mustEnv(emergencyCouncilKey);
    operatorAddress = mustEnv(operatorKey);

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

  if (!emergencyCouncilAddress)
    throw new Error(
      `Set env variable ${emergencyCouncilKey} to an 0x123 encoded public key.`);

  await hre.run("forknet:take-usdt");

  const workerConfigAddress = await deployWorkerConfig(
    hre,
    operatorAddress,
    emergencyCouncilAddress,
  );

  await deployTokens(
    hre,
    shouldDeploy.map(token => TokenList[token]),
    AAVE_V2_POOL_PROVIDER_ADDR,
    "no v3 tokens here",
    emergencyCouncilAddress,
    operatorAddress,
    workerConfigAddress,
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

if (process.env.FLU_ETHEREUM_DEPLOY_ROPSTEN_KEY)
  networks['ropsten'] = {
    accounts: [process.env.FLU_ETHEREUM_DEPLOY_ROPSTEN_KEY],
    url: process.env.FLU_ETHEREUM_DEPLOY_ROPSTEN_URL,
    gas: 9000000
  };

if (process.env.FLU_ETHEREUM_DEPLOY_KOVAN_KEY)
  networks['kovan'] = {
    accounts: [process.env.FLU_ETHEREUM_DEPLOY_KOVAN_KEY],
    url: process.env.FLU_ETHEREUM_DEPLOY_KOVAN_URL
  };

if (process.env.FLU_ETHEREUM_DEPLOY_AURORA_MAINNET_KEY)
  networks['aurora'] = {
    accounts: [process.env.FLU_ETHEREUM_DEPLOY_AURORA_MAINNET_KEY],
    url: process.env.FLU_ETHEREUM_DEPLOY_AURORA_MAINNET_URL,
  };

if (process.env.FLU_ETHEREUM_DEPLOY_ARBITRUM_KEY)
  networks['arbitrum'] = {
    accounts: [process.env.FLU_ETHEREUM_DEPLOY_ARBITRUM_KEY],
    url: process.env.FLU_ETHEREUM_DEPLOY_ARBITRUM_URL,
  };

if (process.env.FLU_ETHEREUM_DEPLOY_MAINNET_KEY)
  networks['mainnet'] = {
    accounts: [process.env.FLU_ETHEREUM_DEPLOY_MAINNET_KEY],
    url: process.env.FLU_ETHEREUM_DEPLOY_MAINNET_URL,
  };

let forkOptions = {};
if (process.env.FLU_FORKNET_NETWORK === "goerli" && process.env.FLU_ETHEREUM_FORKNET_URL_GOERLI) {
  forkOptions = {
    forking: {
      url: process.env.FLU_ETHEREUM_FORKNET_URL_GOERLI,
      blockNumber: 7906700,
    },
  };
} else if (process.env.FLU_FORKNET_NETWORK == "mainnet" && process.env.FLU_ETHEREUM_FORKNET_URL_MAINNET) {
  forkOptions = {
    forking: {
      url: process.env.FLU_ETHEREUM_FORKNET_URL_MAINNET,
      blockNumber: 14098096,
    },
  };
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
      ...forkOptions,
    },
    ...networks,
  },
  docgen: {
    except: [`Interface`, `openzeppelin`],
  }
};
