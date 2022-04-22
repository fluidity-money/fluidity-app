// @ts-ignore
import hre, { ethers, upgrades } from 'hardhat';
import * as readline from 'readline';
import { promisify } from 'util';
import { readFile as readFileCb } from 'fs';
const readFile = promisify(readFileCb);

const rlInterface = readline.createInterface(process.stdin, process.stdout);

const readQuestion = (prompt: string) =>
  new Promise<string>(resolve => rlInterface.question(prompt, resolve));

const ENV_ORACLE = `FLU_ETHEREUM_ORACLE_ADDRESS`;
const ENV_AAVE_ATOKEN_ADDRESS = `FLU_ETHEREUM_AAVE_ATOKEN_ADDRESS`;
const ENV_AAVE_ADDRESS_PROVIDER_ADDRESS = `FLU_ETHEREUM_AAVE_ADDRESS_PROVIDER_ADDRESS`;
const ENV_AAVE_DECIMALS = `FLU_ETHEREUM_AAVE_DECIMALS`;
const ENV_UNDERLYING_TOKEN_NAME = `FLU_ETHEREUM_UNDERLYING_TOKEN_NAME`;
const ENV_UNDERLYING_SYMBOL = `FLU_ETHEREUM_UNDERLYING_SYMBOL`;

const errorIfMissing(envName: string): string => {
  const env = process.env[envName]!;

  if (env == "") {
    console.error(`${envName} not set!`);
    process.exit(1);
  }

  return env;
}:

const oracleAddress = errorIfMissing(ENV_ORACLE);
const aaveAtokenAddress = errorIfMissing(ENV_AAVE_ATOKEN_ADDRESS);
const aaveAddressProviderAddress = errorIfMissing(ENV_AAVE_ADDRESS_PROVIDER_ADDRESS);
const aaveDecimals = errorIfMissing(ENV_AAVE_DECIMALS);
const underlyingTokenName = errorIfMissing(ENV_UNDERLYING_TOKEN_NAME);
const underlyingSymbol = errorIfMissing(ENV_UNDERLYING_SYMBOL);

export const deployToken = async (
  symbol: string,
  longName: string,
  decimals: number,
  aaveAtokenAddress: string,
  aaveAddressProviderAddress: string
) => {
  const [signer] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("TokenAave");

  const token = await upgrades.deployProxy(
    Token,
    [
      aaveATtokenAddress,
      aaveAddressProviderAddress,
      decimals,
      longName,
      symbol,
      oracleAddress
    ]
  );

  await token.deployed();

  console.warn(`Token for ${symbol} deployed at ${token.address}`);
};

const main = async () =>
  deployToken(
    aaveAtokenAddress,
    aaveAddressProviderAddress,
    aaveDecimals,
    underlyingTokenName,
    underlyingSymbol,
    oracleAddress
  );

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
