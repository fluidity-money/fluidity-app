export const gql = String.raw;

export type Queryable = {
  [key: string]: string;
};

type GqlEndpoint = {
  url: string;
  headers: { [key: string]: string };
};

type GqlBackend = "hasura" | "bitquery";

export const networkGqlBackend = (network: string): GqlBackend | null => {
  switch (network) {
    case "ethereum":
      return "bitquery";
    case "solana":
    case "arbitrum":
    case "polygon_zk":
      return "hasura";
    default:
      return null;
  }
};

export const fetchGqlEndpoint = (network: string): GqlEndpoint | null => {
  switch (networkGqlBackend(network)) {
    case "bitquery":
      return {
        url: "https://graphql.bitquery.io",
        headers: { "X-API-KEY": process.env.FLU_BITQUERY_TOKEN ?? "" },
      };
    case "hasura":
      return {
        url: "https://fluidity.hasura.app/v1/graphql",
        headers: {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET ?? "",
        },
      };
    default:
      return null;
  }
};

export const fetchInternalEndpoint = (): GqlEndpoint => ({
  url: "https://fluidity.hasura.app/v1/graphql",
  headers:
    typeof process.env.FLU_HASURA_SECRET === "string"
      ? {
        "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
      }
      : {},
});

export const hasuraDateToUnix = (date: string | number): number =>
  Math.round(Date.parse(String(date) + "Z") / 1000);
