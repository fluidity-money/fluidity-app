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
  suiTypeName?: string;
  decimals: number;
  colour: string;
  enabled: boolean;
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

const getUsdFromTokenAmount = (
  amount: BN,
  decimalsOrToken: number | Token,
  usdPrice = 1
) => {
  const decimals =
    typeof decimalsOrToken === "number"
      ? decimalsOrToken
      : decimalsOrToken.decimals;

  const decimalsAdjDecs = 2;
  const decimalsBn = new BN(10).pow(new BN(decimals - decimalsAdjDecs));

  const usdPriceAdjDecs = 2;
  const usdPriceBn = new BN(usdPrice * 10 ** usdPriceAdjDecs);

  return (
    amount.mul(usdPriceBn).div(decimalsBn).toNumber() /
    10 ** (decimalsAdjDecs + usdPriceAdjDecs)
  );
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

const parseSwapInputToTokenAmount = (input: string, token: Token): BN => {
  const [whole, dec] = input.split(".");

  const wholeBn = getTokenAmountFromUsd(new BN(whole || 0), token);

  if (dec === undefined) {
    return wholeBn;
  }

  const decimalsBn = new BN(dec).mul(
    new BN(10).pow(new BN(token.decimals - dec.length))
  );

  return wholeBn.add(decimalsBn);
};

// Snap the smallest of token balance, remaining mint limit, or swap amt
const snapToValidValue = (input: string, token: Token, userTokenBalance: BN, userMintLimit?: BN, userMintedAmt?: BN): BN => {
  const usdBn = parseSwapInputToTokenAmount(input, token);

  const maxUserPayable = BN.min(usdBn, userTokenBalance);

  if (!userMintLimit) {
    return maxUserPayable;
  }


  const maxMintable = userMintLimit.sub(
    userMintedAmt || new BN(0)
  );

  return BN.min(maxUserPayable, maxMintable);
};

export {
  getTokenForNetwork,
  getTokenFromAddress,
  getTokenFromSymbol,
  getUsdFromTokenAmount,
  snapToValidValue,
  getTokenAmountFromUsd,
  addDecimalToBn,
  fluidAssetOf,
};
