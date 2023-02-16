import webapp from "~/webapp.config.server";
import BN from "bn.js";

export type Token = {
  symbol: string;
  name: string;
  logo: string;
  address: string;
  isFluidOf?: string;
  obligationAccount?: string;
  dataAccount?: string;
  decimals: number;
  colour: string;
};

const getTokenForNetwork = (network: string) => {
  const { config, drivers } = webapp;
  if (Object.keys(drivers).includes(network)) {
    return config[network]?.fluidAssets;
  }
  return [];
};

const getTokenFromAddress = (
  network: string,
  address: string
): Token | undefined => {
  const { drivers, config } = webapp;

  if (!Object.keys(drivers).includes(network)) {
    return undefined;
  }

  const { tokens } = config[network];

  const matchingTokens = tokens.filter(
    (token: Token) => token.address === address
  );

  return matchingTokens[0];
};

const getTokenFromSymbol = (
  network: string,
  symbol: string
): Token | undefined => {
  const { drivers, config } = webapp;

  if (!Object.keys(drivers).includes(network)) {
    return undefined;
  }

  const { tokens } = config[network];

  const matchingTokens = tokens.filter(
    (token: Token) => token.symbol === symbol
  );

  return matchingTokens[0];
};

// find the fluid counterpart of assetToken in tokens, or return
// itself if already fluid
const fluidAssetOf = (tokens: Token[], assetToken: Token): Token | undefined =>
  assetToken.isFluidOf
    ? assetToken
    : tokens.find(({ isFluidOf }) => isFluidOf === assetToken.address);

const getUsdFromTokenAmount = (amount: BN, decimalsOrToken: number | Token) => {
  const decimals = typeof decimalsOrToken === 'number' ? decimalsOrToken : decimalsOrToken.decimals;
  return amount.div(new BN(10).pow(new BN(decimals - 2))).toNumber() / 100;
};

const getTokenAmountFromUsd = (usd: BN, { decimals }: Token) =>
  usd.mul(new BN(10).pow(new BN(decimals)));

// Format BN with decimals
const addDecimalToBn = (amount: BN, decimals: number) => {
  const whole = amount.toString().slice(0, -decimals) || "0";

  const dec = amount
    .toString()
    .slice(0 - decimals)
    .padStart(decimals, "0")
    .replace(/0+$/, "");

  return !dec ? whole : `${whole}.${dec}`;
};

export {
  getTokenForNetwork,
  getTokenFromAddress,
  getTokenFromSymbol,
  getUsdFromTokenAmount,
  getTokenAmountFromUsd,
  addDecimalToBn,
  fluidAssetOf,
};
