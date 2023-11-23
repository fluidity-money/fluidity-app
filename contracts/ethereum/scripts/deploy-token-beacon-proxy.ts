import hre from 'hardhat'
import { mustEnv } from '../script-utils';
import type { ethers } from 'ethers';

const ENV_EXECUTOR = `FLU_ETHEREUM_EXECUTOR_ADDRESS`;

const ENV_OPERATOR = `FLU_ETHEREUM_OPERATOR_ADDRESS`;
const ENV_COUNCIL = `FLU_ETHEREUM_EMERGENCY_COUNCIL_ADDRESS`;

const ENV_TOKEN_BACKEND = `FLU_ETHEREUM_TOKEN_BACKEND`;

const ENV_BEACON_POOL = `FLU_ETHEREUM_BEACON_POOL`;
const ENV_BEACON_TOKEN = `FLU_ETHEREUM_BEACON_TOKEN`;

const ENV_AAVE_V2_ATOKEN = `FLU_ETHEREUM_AAVE_V2_ATOKEN_ADDRESS`;
const ENV_AAVE_V2_ADDRESS_PROVIDER = `FLU_ETHEREUM_AAVE_V3_PROVIDER_ADDRESS`;

const ENV_AAVE_V3_ATOKEN = `FLU_ETHEREUM_AAVE_V3_ATOKEN_ADDRESS`;
const ENV_AAVE_V3_ADDRESS_PROVIDER = `FLU_ETHEREUM_AAVE_V3_PROVIDER_ADDRESS`;

const ENV_COMPOUND_CTOKEN = `FLU_ETHEREUM_COMPOUND_CTOKEN_ADDRESS`;

const ENV_STUPID_UNDERLYING = `FLU_ETHEREUM_STUPID_UNDERLYING`;

const ENV_DECIMALS = `FLU_ETHEREUM_DECIMALS`;
const ENV_SYMBOL = `FLU_ETHEREUM_TOKEN_SYMBOL`;
const ENV_NAME = `FLU_ETHEREUM_TOKEN_NAME`;

const main = async () => {
  const backend = mustEnv(ENV_TOKEN_BACKEND);

  const poolAddress = mustEnv(ENV_BEACON_POOL);
  const tokenAddress = mustEnv(ENV_BEACON_TOKEN);

  const executor = mustEnv(ENV_EXECUTOR);

  const operator = mustEnv(ENV_OPERATOR);
  const council = mustEnv(ENV_COUNCIL);
  const decimals = mustEnv(ENV_DECIMALS);
  const symbol = mustEnv(ENV_SYMBOL);
  const name = mustEnv(ENV_NAME);

  const tokenFactory = await hre.ethers.getContractFactory("Token");
  const compoundFactory = await hre.ethers.getContractFactory("CompoundLiquidityProvider");
  const aaveV2Factory = await hre.ethers.getContractFactory("AaveV2LiquidityProvider");
  const aaveV3Factory = await hre.ethers.getContractFactory("AaveV3LiquidityProvider");
  const stupidFactory = await hre.ethers.getContractFactory("StupidLiquidityProvider");

  console.log(`deploying token with beacon address ${tokenAddress}`);

  const token = await hre.upgrades.deployBeaconProxy(
    tokenAddress,
    tokenFactory,
  );

  await token.deployed();

  console.log(`token beacon proxy deployed to address ${token.address}`);

  let pool: ethers.Contract;

  let aToken: string;
  let aavePool: string;

  switch (backend) {
  case "compound":
    const cToken = mustEnv(ENV_COMPOUND_CTOKEN);
    console.log(`deploying compound pool with beacon ${poolAddress}, ctoken ${cToken}`);
    pool = await hre.upgrades.deployBeaconProxy(
      poolAddress,
      compoundFactory,
      [cToken, token.address],
      {initializer: "init(address, address)"},
    );
    break;

  case "aaveV2":
    aToken = mustEnv(ENV_AAVE_V2_ATOKEN);
    aavePool = mustEnv(ENV_AAVE_V2_ADDRESS_PROVIDER);
    console.log(`deploying aave v2 pool with beacon ${poolAddress}, atoken ${aToken}, aave pool ${aavePool}`);
    pool = await hre.upgrades.deployBeaconProxy(
      poolAddress,
      aaveV2Factory,
      [aavePool, aToken, token.address],
      {initializer: "init(address, address, address)"},
    );
    break;

  case "aaveV3":
    aToken = mustEnv(ENV_AAVE_V3_ATOKEN);
    aavePool = mustEnv(ENV_AAVE_V3_ADDRESS_PROVIDER);
    console.log(`deploying aave v3 pool with beacon ${poolAddress}, atoken ${aToken}, aave pool ${aavePool}`);
    pool = await hre.upgrades.deployBeaconProxy(
      poolAddress,
      aaveV3Factory,
      [aavePool, aToken, token.address],
      {initializer: "init(address, address, address)"},
    );
    break;

  case "stupid":
    const underlying = mustEnv(ENV_STUPID_UNDERLYING);
    console.log(`deploying stupid pool with beacon ${poolAddress}, underlying ${underlying}`);
    pool = await hre.upgrades.deployBeaconProxy(
      poolAddress,
      stupidFactory,
      [underlying, token.address],
      {initializer: "init(address,address)"},
    );
    break;

  default:
    throw new Error(
      `Invalid token backend: ${backend} - should be 'compound' or 'aaveV2' or 'aaveV3'`
    );
  }

  await pool.deployed();

  console.log(`liquidity pool deployed to address ${pool.address}`);

  console.log(
    `initialising token with executor ${executor} operator ${operator} council ${council} decimals ${decimals} symbol ${symbol} name ${name}`
  );

  await token.functions.init(
    pool.address,
    decimals,
    name,
    symbol,
    council,
    operator,
    executor
  );
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);
