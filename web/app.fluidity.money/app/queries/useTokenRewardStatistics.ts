import { gql, jsonPost } from "~/util";
import { Chain } from "~/util/chainUtils/chains"

const query = gql`
  fragment tokenPerformanceFields on token_performance_return {
    average_reward
    count
    highest_reward
    token
  }
  query TokenPerformance($network: network_blockchain!) {
    week: token_performance(
      limit: 1
      order_by: {highest_reward: asc}
      args: { filter_network: $network, i: "1 week" }
    ) {
      ...tokenPerformanceFields
    }
    month: token_performance(
      limit: 1
      order_by: {highest_reward: asc}
      args: { filter_network: $network, i: "1 month" }
    ) {
      ...tokenPerformanceFields
    }
    year: token_performance(
      limit: 1
      order_by: {highest_reward: asc}
      args: { filter_network: $network, i: "1 year" }
    ) {
      ...tokenPerformanceFields
    }
    all: token_performance(
      limit: 1
      order_by: {highest_reward: asc}
      args: { filter_network: $network }
    ) {
      ...tokenPerformanceFields
    }
  }
`;

const useTokenRewardStatistics = async (
  network: Chain | string
) => {
  const variables = { network, };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: query,
  };

  return jsonPost<TokenRewardBody, TokenRewardResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

type TokenRewardBody = {
  variables: {
    network: string;
  };
  query: string;
};

export type TokenReward = {
  count: number;
  average_reward: number;
  highest_reward: number;
  token: string;
};

export type TokenRewardResponse = {
  data?: {
    week: Array<TokenReward>;
    month: Array<TokenReward>;
    year: Array<TokenReward>;
    all: Array<TokenReward>;
  };

  errors?: unknown;
};

export default useTokenRewardStatistics;
