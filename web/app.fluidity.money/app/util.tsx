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
