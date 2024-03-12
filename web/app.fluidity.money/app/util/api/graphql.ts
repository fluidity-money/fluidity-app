export const gql = String.raw;

export type Queryable = {
  [key: string]: string;
};

type GqlEndpoint = {
  url: string;
  headers: { [key: string]: string };
};

type GqlBackend = "hasura";

const HasuraUrl = "https://fluidity.hasura.app/v1/graphql";

export const networkGqlBackend = (network: string): GqlBackend | null => {
  switch (network) {
    case "solana":
    case "arbitrum":
    case "polygon_zk":
    case "sui":
      return "hasura";
    default:
      return null;
  }
};

export const fetchGqlEndpoint = (network: string): GqlEndpoint | null => {
  switch (networkGqlBackend(network)) {
    case "hasura":
      return {
        url: HasuraUrl,
        headers: {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET ?? "",
        },
      };
    default:
      return null;
  }
};

export const fetchInternalEndpoint = (): GqlEndpoint => ({
  url: HasuraUrl,
  headers:
    typeof process.env.FLU_HASURA_SECRET === "string"
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {},
});

export const hasuraDateToUnix = (date: string | number): number =>
  Math.round(Date.parse(String(date) + "Z") / 1000);
