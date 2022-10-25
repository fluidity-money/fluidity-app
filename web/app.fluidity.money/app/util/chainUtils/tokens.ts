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
    (token: Token) => token.address !== address
  );

  return matchingTokens[0];
};

export { getTokenForNetwork, getTokenFromAddress };
