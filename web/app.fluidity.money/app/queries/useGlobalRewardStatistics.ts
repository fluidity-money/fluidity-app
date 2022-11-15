import { gql, jsonPost } from "~/util";

const query = gql`
  query ExpectedRewards($network: network_blockchain!) {
    expected_rewards(
      where: { network: { _eq: $network } }
      order_by: { awarded_month: desc, token_short_name: desc }
      distinct_on: token_short_name
    ) {
      token_short_name
      network
      count
      average_reward
      awarded_month
      highest_reward
    }
  }
`;

const useGlobalRewardStatistics = async (network: string) => {
  const variables = { network };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: query,
  };

  return jsonPost<ExpectedRewardBody, ExpectedRewardResponse>(url, body);
};

type ExpectedRewardBody = {
  variables: {
    network: string;
  };
  query: string;
};

type ExpectedRewardResponse = {
  data?: {
    expected_rewards: Array<{
      token_short_name: string;
      network: string;
      count: number;
      average_reward: number;
      highest_reward: number;
      awarded_month: string;
    }>;
  };

  errors?: unknown;
};

export default useGlobalRewardStatistics;
