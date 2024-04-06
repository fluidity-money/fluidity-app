import { gql, jsonPost } from "~/util";

const query = gql`
  query GetAssetStatistics(
    $token_name: String!
    $address: String!
    $network: network_blockchain!
  ) {
    user: winners_aggregate(
      where: {
        token_short_name: { _eq: $token_name }
        winning_address: { _eq: $address }
        network: { _eq: $network }
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
      where: {
        token_short_name: { _eq: $token_name }
        network: { _eq: $network }
      }
    ) {
      aggregate {
        max {
          winning_amount
          transaction_hash
        }
      }
    }
  }
`;

type AssetStatisticsRequest = {
  query: string;
  variables: {
    token_name: string;
    address: string;
    network: string;
  };
};

export type AssetPrize = {
  winning_amount: number;
  transaction_hash: string;
};

type AssetStatisticsResponse = {
  data?: {
    user: {
      aggregate: {
        max: AssetPrize;
        avg: {
          winning_amount: number;
        };
      };
    };
    global: {
      aggregate: {
        max: AssetPrize;
      };
    };
  };
  error?: string;
};

const useAssetStatistics = (
  network: string,
  tokenName: string,
  userAddress: string
) => {
  const body = {
    query: query,
    variables: {
      token_name: tokenName.toUpperCase(),
      address: userAddress,
      network,
    },
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<AssetStatisticsRequest, AssetStatisticsResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export default useAssetStatistics;
