import { gql } from "~/util";
import { jsonPost } from "~/util/api/rpc";

const queryByNetwork = gql`
  query HighestRewardsByNetwork($network: network_blockchain!) {
    highest_rewards_monthly(where: { network: { _eq: $network } }) {
      network
      transaction_hash
      winning_address
      awarded_day
      token_short_name
      winning_amount_scaled
    }
    highest_reward_winner_totals(where: { network: { _eq: $network } }) {
      network
      transaction_count
      winning_address
      total_winnings
    }
  }
`;

const queryAll = gql`
  query HighestRewardsAllNetworks {
    highest_rewards_monthly {
      network
      transaction_hash
      winning_address
      awarded_day
      token_short_name
      winning_amount_scaled
    }
    highest_reward_winner_totals {
      network
      transaction_count
      winning_address
      total_winnings
    }
  }
`;

export type HighestRewardMonthly = {
  network: string;
  transaction_hash: string;
  winning_address: string;
  awarded_day: string;
  token_short_name: string;
  winning_amount_scaled: number;
};

export type HighestRewardWinnerTotal = {
  network: string;
  winning_address: string;
  transaction_count: number;
  total_winnings: number;
};

export type HighestRewardResponse = {
  data: {
    highest_rewards_monthly: HighestRewardMonthly[];
    highest_reward_winner_totals: HighestRewardWinnerTotal[];
  };
  errors?: Record<string, unknown>;
};

type HighestRewardByNetworkBody = {
  variables: {
    network: string;
  };
  query: string;
};

const useHighestRewardStatisticsByNetwork = async (network: string) => {
  if (network !== "ethereum") {
    throw Error(`network ${network} not supported`);
  }

  const variables = { network };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryByNetwork,
  };
  const response = await jsonPost<
    HighestRewardByNetworkBody,
    HighestRewardResponse
  >(
    url,
    body,
    process.env.HASURA_TOKEN
      ? {
          "x-hasura-admin-secret": process.env.HASURA_TOKEN,
        }
      : {}
  );

  return response;
};

type HighestRewardAllBody = {
  query: string;
};

const useHighestRewardStatisticsAll = async () => {
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    query: queryAll,
  };

  const response = await jsonPost<HighestRewardAllBody, HighestRewardResponse>(
    url,
    body,
    process.env.HASURA_TOKEN
      ? {
          "x-hasura-admin-secret": process.env.HASURA_TOKEN,
        }
      : {}
  );

  return response;
};

export { useHighestRewardStatisticsAll, useHighestRewardStatisticsByNetwork };
