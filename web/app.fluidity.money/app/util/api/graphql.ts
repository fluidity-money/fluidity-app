export const gql = String.raw;

export type Queryable = {
  [key: string]: string;
};

export const fetchGqlEndpoint = (network: string): {url: string, headers: {[key: string]: string}} | null => {
  switch (network) {
    case "ethereum":
    case "solana":
      return {
        url: "https://graphql.bitquery.io",
        headers: {"X-API-KEY": process.env.FLU_BITQUERY_TOKEN ?? ""},
      }
    case "arbitrum":
      return {
        url: "https://fluidity.hasura.app/v1/graphql",
        headers: {"x-hasura-admin-secret": process.env.FLU_HASURA_SECRET ?? ""},
      }
    default:
      return null
  }
}
