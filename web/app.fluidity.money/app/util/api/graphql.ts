import webapp from "~/webapp.config.server";

export const gql = String.raw;

export type Queryable = {
  [key: string]: string;
};

export const getTokenForNetwork = (network: string) => {
  const { config, drivers } = webapp;
  if (Object.keys(drivers).includes(network)) {
    return config[network]?.fluidAssets;
  }
  return [];
};

export const getTokenFromAddress = (network: string, address: string) => {
  const { drivers, config } = webapp;
  if (!Object.keys(drivers).includes(network)) {
    return null
  }
  
  const tokens = config[network].tokens;
  
  let matchingToken;
  
  // .every iterates until falsy value
  tokens.every(token => {
    if (token.address !== address) {
      return true;
    }
    
    matchingToken = token;
    return false;
  })
  
  return matchingToken;
}
