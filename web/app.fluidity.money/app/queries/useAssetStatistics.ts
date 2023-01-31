import { gql, jsonPost, Queryable } from "~/util";


const query: Queryable = {
  ethereum: gql`
    query GetAssetStatistics($token_name: String!, $address: String!) {
      user: winners_aggregate(
        where: {
          token_short_name: { _eq: $token_name }
          winning_address: { _eq: $address }
        }
      ) {
        aggregate {
          avg {
            winning_amount
          }
          max {
            winning_amount
            transaction_hash
          }
        }
      }
      global: winners_aggregate(
        where: { token_short_name: { _eq: $token_name } }
      ) {
        aggregate {
          max {
            winning_amount
            transaction_hash
          }
        }
      }
    }
  `,
};

type AssetStatisticsRequest = {
  query: string;
  variables: {
    token_name: string;
    address: string;
  };
};

type AssetStatisticsResponse = {
  data?: {
    user: {
      aggregate: {
        max: {
          winning_amount: number;
          transaction_hash: string;
        }
        avg: {
          winning_amount: number;
        }
      }
    }
    global: {
      aggregate: {
        max: {
          winning_amount: number;
          transaction_hash: string;
        }
      }
    }
  };
  error?: string;
};

const useAssetStatistics = async (network: string, tokenName: string, userAddress: string) => {
  if (network !== "ethereum") {
    throw Error(`network ${network} not supported`);
  }

  const body = {
    query: query[network],
    variables: {
      token_name: tokenName.toUpperCase(),
      address: userAddress,
    },
  };

  const fluGqlEndpoint = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<AssetStatisticsRequest, AssetStatisticsResponse>(
    fluGqlEndpoint,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};


export default useAssetStatistics;
