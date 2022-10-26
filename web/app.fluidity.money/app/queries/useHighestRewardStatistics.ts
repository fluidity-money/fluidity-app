import { Rewarder } from "~/routes/$network/dashboard/rewards";
import { gql, Queryable } from "~/util";
import { jsonPost } from "~/util/api/rpc";

const query: Queryable = {
  ethereum: gql`
    query HighestRewards($network: network_blockchain!) {
      highest_rewards_monthly(where:{network:{_eq:{$network}}}) {
        network
        transaction_hash
        winning_address
        awarded_day 
        token_short_name
        winning_amount_scaled
      }
      highest_reward_winner_totals(where:{network:{_eq:{$network}}}) {
        transaction_count
        winning_address
        total_winnings
      }
    }
  `,
  solana: gql``
};

type HighestRewardBody = {
  variables: {
    network: string;
  };
  query: string;
};

type HighestRewardResponse = {
  data: {
    highest_rewards_monthly: Array<{
      network: string
      transaction_hash: string
      winning_address: string
      awarded_day: string
      token_short_name: string
      winning_amount_scaled: number
    }>,
    highest_reward_winner_totals:  Array<{
      winning_address: string
      transaction_count: number
      total_winnings: number
    }>
  }
};

const useHighestRewardStatistics = async (network: string) => {
  if (network !== "ethereum") {
    throw Error(`network ${network} not supported`);
  }

  const variables = { network };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: query[network],
  };
  const response = jsonPost<HighestRewardBody, HighestRewardResponse>(
    url,
    body
  );

  return response;
};

export default useHighestRewardStatistics;
