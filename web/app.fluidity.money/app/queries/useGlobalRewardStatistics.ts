import {Rewarder} from "~/routes/$network/dashboard/rewards";
import { gql, Queryable } from "~/util";
import {jsonPost} from "~/util/api/rpc";

const query: Queryable = {
  // most recent month for each token
  ethereum: gql`query ExpectedRewards($network: network_blockchain!){
    expected_rewards(
      where: {network: {_eq: $network}}, 
      order_by: {awarded_month: desc, token_short_name: desc}, 
      distinct_on: token_short_name
    ) {
      token_short_name
      network
      count
      average_reward
      awarded_month
      highest_reward
    }
  }`,

  solana: gql``,
};

const useGlobalRewardStatistics = async (network: string) => {
  if (network !== "ethereum") {
    throw Error(`network ${network} not supported`);
  }

  const variables = {network}
  const url = "https://fluidity.hasura.app/v1/graphql"
  const body = {
    variables,
    query: query[network]
  }
  const response = jsonPost<
    ExpectedRewardBody,
    ExpectedRewardResponse
  >(url, body);

  return response;
};

type ExpectedRewardBody = {
  variables: {
    network: string
  }
  query: string
};

type ExpectedRewardResponse = {
  data: {
    expected_rewards: Array<{
      token_short_name: string,
      network: string,
      count: number,
      average_reward: number,
      highest_reward: number,
      awarded_month: string
    }>
  }
}

export default useGlobalRewardStatistics;
