import { ethers } from "ethers";
import * as hre from "hardhat";
import { deployTokens, deployRewardPools, forknetTakeFunds } from "../script-utils";
import { AAVE_V2_POOL_PROVIDER_ADDR, TokenList } from "../test-constants";

import { commonBindings, commonContracts, signers } from "./setup-common";

export let contracts: typeof commonContracts & {
  usdt: {
    deployedToken: ethers.Contract,
    deployedPool: ethers.Contract,
  },
  fei: {
    deployedToken: ethers.Contract,
    deployedPool: ethers.Contract,
  },
  dai: {
    deployedToken: ethers.Contract,
    deployedPool: ethers.Contract,
  },
  weth: {
    deployedToken: ethers.Contract,
    deployedPool: ethers.Contract,
  },
  rewardPools: ethers.Contract,
  ethConvertor: ethers.Contract,
  registry: ethers.Contract
};

export let bindings: typeof commonBindings & {
  usdt: {
    baseAccount1: ethers.Contract,
    fluidAccount1: ethers.Contract,
    fluidAccount2: ethers.Contract,
    // this is the operator contract!!
    oracleBoundOperator: ethers.Contract,
    externalOperator: ethers.Contract,
    emergencyCouncil: ethers.Contract,
  },
  fei: {
    base: ethers.Contract,
    fluid: ethers.Contract,
  },
  dai: {
    base: ethers.Contract,
    fluid: ethers.Contract,
  },
  weth: {
    base: ethers.Contract,
    fluid: ethers.Contract
  },
  rewardPools: {
    operator: ethers.Contract,
  },
  ethConvertor: {
    operator: ethers.Contract
  },
  registry: {
    operator: ethers.Contract
  }
};

before(async function () {
  if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
    console.log("not on a mainnet fork! skipping most tests!");
    return;
  }

  const toDeploy = [
    TokenList["usdt"],
    TokenList["fei"],
    TokenList["dai"],
    TokenList["weth"]
  ];

  await forknetTakeFunds(
    hre,
    [await signers.userAccount1.getAddress()],
    toDeploy,
  );

  const { tokens } = await deployTokens(
    hre,
    toDeploy,
    AAVE_V2_POOL_PROVIDER_ADDR,
    "no v3 tokens here",
    signers.token.emergencyCouncil,
    signers.token.externalOperator,
    commonBindings.operator.externalOperator,
    signers.token.externalOracle,
  );

  const tokenOracleAddress = await signers.token.externalOracle.getAddress();

  const oracles = Object.values(tokens)
    .map(t => [t.deployedToken.address, tokenOracleAddress]);

  await commonBindings.operator.externalOperator.updateOracles(oracles);

  const rewardPools = await deployRewardPools(
    hre,
    signers.rewardPools.externalOperator,
    Object.values(tokens).map(e => e.deployedToken),
  );

  const convertorEthToTokenFactory = await hre.ethers.getContractFactory(
    "ConvertorEthToToken"
  );

  const ethConvertor = await convertorEthToTokenFactory.deploy(
    tokens["fwETH"].deployedToken.address,
    TokenList["weth"].address
  );

  contracts = {
    ...commonContracts,
    usdt: tokens["fUSDt"],
    fei: tokens["fFei"],
    dai: tokens["fDAI"],
    weth: tokens["fwETH"],
    rewardPools,
    ethConvertor
  };

  bindings = {
    ...commonBindings,
    usdt: {
      baseAccount1: await hre.ethers.getContractAt("IERC20", TokenList["usdt"].address, signers.userAccount1),
      fluidAccount1: contracts.usdt.deployedToken.connect(signers.userAccount1),
      fluidAccount2: contracts.usdt.deployedToken.connect(signers.userAccount2),
      externalOperator: contracts.usdt.deployedToken.connect(signers.token.externalOperator),
      emergencyCouncil: contracts.usdt.deployedToken.connect(signers.token.emergencyCouncil),
      oracleBoundOperator: contracts.operator.connect(signers.token.externalOracle),
    },
    fei: {
      base: await hre.ethers.getContractAt("IERC20", TokenList["fei"].address, signers.userAccount1),
      fluid: contracts.fei.deployedToken.connect(signers.userAccount1),
    },
    dai: {
      base: await hre.ethers.getContractAt("IERC20", TokenList["dai"].address, signers.userAccount1),
      fluid: contracts.dai.deployedToken.connect(signers.userAccount1),
    },
    weth: {
      base: await hre.ethers.getContractAt("IERC20", TokenList["weth"].address, signers.userAccount1),
      fluid: contracts.weth.deployedToken.connect(signers.userAccount1),
    },
    rewardPools: {
      operator: contracts.rewardPools.connect(signers.rewardPools.externalOperator),
    },
    ethConvertor: {
      operator: contracts.ethConvertor.connect(signers.fwEthAccount)
    }
  };
});
