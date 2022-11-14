import webapp from "~/webapp.config.server";

const getTokenForNetwork = (network: string) => {
  const { config, drivers } = webapp;
  if (Object.keys(drivers).includes(network)) {
    return config[network]?.fluidAssets;
  }
  return [];
};

export type Token = {
  symbol: string;
  name: string;
  logo: string;
  address: string;
  isFluidOf?: string;
  obligationAccount?: string;
  dataAccount?: string;
  decimals: number;
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
// its own address if already fluid
const fluidAssetOf = (tokens: Token[], assetToken: Token): string | undefined =>
  assetToken.isFluidOf
    ? assetToken.address
    : tokens.find(({ isFluidOf }) => isFluidOf === assetToken.address)?.address;

export {
  getTokenForNetwork,
  getTokenFromAddress,
  getTokenFromSymbol,
  fluidAssetOf,
};
