// @ts-ignore
import hre, { ethers, upgrades } from 'hardhat';
import * as readline from 'readline';
import { promisify } from 'util';
import { readFile as readFileCb } from 'fs';
const readFile = promisify(readFileCb);

const rlInterface = readline.createInterface(process.stdin, process.stdout);
const readQuestion = (prompt: string) => new Promise<string>(resolve => rlInterface.question(prompt, resolve));

const ENV_ORACLE = `FLU_ETHEREUM_ORACLE_ADDRESS`;

const oracleAddress = process.env[ENV_ORACLE]!;

if (!oracleAddress) {
  console.error("FLU_ETHEREUM_ORACLE_ADDRESS not set!");
  process.exit(1);
}

const erc20Abi = [
  'function name() returns (string)',
  'function symbol() returns (string)',
  'function decimals() returns (uint8)',
];

const compoundAbi = [
  ...erc20Abi,
  'function underlying() returns (address)',
];

export const automaticDeploy = async (
  cSymbol: string,
) => {
  const symbol = `f${cSymbol}`;
  const longName = `Fluid ${cSymbol}`;

  const compoundPath = `./scripts/compound/${hre.network.name}.json`;
  const compoundFile = await readFile(compoundPath)
    .then(res => JSON.parse('' + res))
    .catch(e => {
      if (e.code === `ENOENT`) {
        console.log(`could not find file '${compoundPath}'`);
        process.exit(1);
      }
      throw e;
    });

  const compoundAddress = compoundFile['Contracts'][`c${cSymbol}`] as string;
  if (!compoundAddress) {
    console.log(`could not find token c${cSymbol}`);
    process.exit(1);
  }

  if (!compoundFile['Contracts'][cSymbol]) console.log(`underlying token ${cSymbol} doesn't exist in the compound file...`);

  await deployToken(symbol, longName, compoundAddress);
};

export const deployToken = async (
  symbol: string,
  longName: string,
  compoundAddress: string,
) => {
  const [signer] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("TokenCompound");

  const compoundTokenERC20 = new hre.ethers.Contract(
    compoundAddress,
    compoundAbi,
    signer,
  );
  const compoundName = await compoundTokenERC20.callStatic.name();
  const compoundSymbol = await compoundTokenERC20.callStatic.symbol();

  let underlying;
  try {
    underlying = await compoundTokenERC20.callStatic.underlying();
  } catch {
    console.log(`failed to get the underlying token!`);
    console.log(`this usually means the token you passed isn't a compound token`);
    console.log(`(you passed ${compoundAddress}, which is ${compoundName} (${compoundSymbol}))`);
    process.exit(1);
  }

  const underlyingERC20 = new hre.ethers.Contract(
    underlying,
    erc20Abi,
    signer,
  );
  const underlyingName = await underlyingERC20.callStatic.name();
  const underlyingSymbol = await underlyingERC20.callStatic.symbol();
  const underlyingDecimals = await underlyingERC20.callStatic.decimals();

  console.log(`deploying ${longName} (${symbol})`);
  console.log(`for compound token ${compoundName} (${compoundSymbol})`);
  console.log(`with underlying token ${underlyingName} (${underlyingSymbol})`);

  const continueResponse = await readQuestion("continue? [y/n] ");
  if (continueResponse.toLowerCase() != 'y') {
    process.exit(0);
  }

  const token = await upgrades.deployProxy(
    Token,
    [compoundAddress, underlyingDecimals, longName, symbol, oracleAddress],
  );

  await token.deployed();
  console.warn(`Token for ${symbol} deployed at ${token.address}`);
};

const main = async () =>
  automaticDeploy(process.env.FLU_UNDERLYING_TOKEN_SYMBOL!);

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
