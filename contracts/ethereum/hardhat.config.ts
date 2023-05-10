
import "@nomiclabs/hardhat-waffle";

import "@openzeppelin/hardhat-upgrades";

import "hardhat-dependency-compiler";

import "hardhat-docgen";

import { task, subtask } from "hardhat/config";

import type { HardhatUserConfig } from "hardhat/types";

import { TASK_NODE_SERVER_READY } from "hardhat/builtin-tasks/task-names";

import {
  setOracles,
  forknetTakeFunds,
  mustEnv } from './script-utils';

import {
  getFactories,
  deployBeacons,
  deployTokens,
  deployRegistry,
  deployOperator,
  deployTestUtilityWithoutDAO } from './deployment';

import {
  AAVE_V2_POOL_PROVIDER_ADDR,
  TokenList } from "./mainnet-constants";

const oracleKey = `FLU_ETHEREUM_ORACLE_ADDRESS`;

const emergencyCouncilKey = `FLU_ETHEREUM_EMERGENCY_COUNCIL_ADDRESS`;

const operatorKey = `FLU_ETHEREUM_OPERATOR_ADDRESS`;

let oracleAddress: string;

let emergencyCouncilAddress: string;

let externalOperatorAddress: string;

let shouldDeploy: (keyof typeof TokenList)[] = [];

task("deploy-forknet", "Starts a node on forked mainnet with the contracts initialized")
  .addOptionalParam("tokens", "the tokens to deploy")
  .setAction(async (args, hre) => {
    oracleAddress = mustEnv(oracleKey);
    emergencyCouncilAddress = mustEnv(emergencyCouncilKey);
    externalOperatorAddress = mustEnv(operatorKey);

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

  for (const address of [oracleAddress, emergencyCouncilAddress, externalOperatorAddress]) {
    await hre.network.provider.send(
      "hardhat_setBalance",
      [
        address,
        "0x1000000000000000000000000000000000000000000000000000000000000000",
      ],
    );
  }

  await hre.run("forknet:take-usdt");

  const {
    token: tokenFactory,
    compoundLiquidityProvider: compoundFactory,
    aaveV2LiquidityProvider: aaveV2Factory,
    aaveV3LiquidityProvider: aaveV3Factory,
    operator: operatorFactory,
    registry: registryFactory
  } = await getFactories(hre);

  const [
    tokenBeacon,
    compoundBeacon,
    aaveV2Beacon,
    aaveV3Beacon,
    operatorBeacon,
    registryBeacon
  ] = await deployBeacons(
    tokenFactory,
    externalOperatorAddress,
    compoundFactory,
    aaveV2Factory,
    aaveV3Factory,
    operatorFactory,
    registryFactory
  );

  const rootSigner = (await hre.ethers.getSigners())[0];

  const registry = await deployRegistry(
    hre,
    rootSigner,
    registryFactory,
    registryBeacon.address,
    externalOperatorAddress
  );

  const operator = await deployOperator(
    hre,
    rootSigner,
    operatorFactory,
    operatorBeacon.address,
    externalOperatorAddress,
    emergencyCouncilAddress,
    registry.address
  );

  const { tokens } = await deployTokens(
    hre,
    shouldDeploy.map(token => TokenList[token]),
    AAVE_V2_POOL_PROVIDER_ADDR,
    "no v3 tokens here",
    emergencyCouncilAddress,
    externalOperatorAddress,
    operator,
    registry,
    externalOperatorAddress,

    tokenFactory,
    tokenBeacon.address,
    compoundFactory,
    compoundBeacon.address,
    aaveV2Factory,
    aaveV2Beacon.address,
    aaveV3Factory,
    aaveV3Beacon.address
  );

  await setOracles(
    hre,
    Object.values(tokens).map(t => t.deployedToken.address),
    externalOperatorAddress,
    oracleAddress,
    operator,
  );

  const testClient = await deployTestUtilityWithoutDAO(
    hre,
    operator,
    tokens["fUSDT"].deployedToken.address
  );

  console.log(`deployed the test util client to ${testClient.address} on token ${tokens["fUSDT"].deployedToken.address}`);

  console.log(`deployment complete`);
});

subtask("forknet:take-usdt", async (_taskArgs, hre) => {
  const accounts = [oracleAddress, ...(await hre.ethers.getSigners()).slice(0, 1).map(a => a.address)];

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

const enableMainnet =
  process.env.FLU_FORKNET_NETWORK == "mainnet" &&
  "FLU_ETHEREUM_FORKNET_URL_MAINNET" in process.env;

const enableGoerli =
  process.env.FLU_FORKNET_NETWORK == "goerli" &&
  "FLU_ETHEREUM_FORKNET_URL_GOERLI" in process.env;

const enableArbitrum =
  process.env.FLU_FORKNET_NETWORK == "arbitrum" &&
  "FLU_ETHEREUM_FORKNET_URL_ARBITRUM" in process.env;

if (enableMainnet)
  forkOptions = {
    forking: {
      url: process.env.FLU_ETHEREUM_FORKNET_URL_MAINNET,
      blockNumber: 14098096,
    },
  };

if (enableGoerli)
  forkOptions = {
    forking: {
      url: process.env.FLU_ETHEREUM_FORKNET_URL_GOERLI,
      blockNumber: 7906700,
    },
  };

if (enableArbitrum)
  forkOptions = {
    forking: {
      url: process.env.FLU_ETHEREUM_FORKNET_URL_ARBITRUM,
      blockNumber: 88060360,
    },
  };

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000000,
        details: {
          cse: true,
          yul: true,
        }
      },
      debug: {
        revertStrings: "debug",
      }
    },
  },
  etherscan: {
    apiKey: process.env.FLU_ETHERSCAN_API
  },
  dependencyCompiler: {
    paths: [
      "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol",
      "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol",
      "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol"

    ]
  },
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
