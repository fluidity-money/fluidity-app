import webapp from "~/webapp.config.server";

const getTokenForNetwork = (network: string) => {
  const { config, drivers } = webapp;
  if (Object.keys(drivers).includes(network)) {
    return config[network]?.fluidAssets;
  }
  return [];
};

type Token = {
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

  const tokens = config[network].tokens;

  let matchingToken;

  // .every iterates until falsy value
  tokens.every((token) => {
    if (token.address !== address) {
      return true;
    }

    matchingToken = token;
    return false;
  });

  return matchingToken;
};

export { getTokenForNetwork, getTokenFromAddress };
