import { jsonPost, gql, fetchInternalEndpoint } from "~/util";

const queryByUserAllTime = gql`
  query AirdropLeaderboard($address: String!) {
    airdrop_leaderboard(where: { address: { _eq: $address } }, limit: 1) {
      user: address
      rank
      referralCount: referral_count
      bottles: total_lootboxes
      highestRewardTier: highest_reward_tier
      liquidityMultiplier: liquidity_multiplier
    }
  }
`;

const queryAllTime = gql`
  query AirdropLeaderboard {
    airdrop_leaderboard(limit: 16, order_by: { total_lootboxes: desc }) {
      user: address
      rank
      referralCount: referral_count
      bottles: total_lootboxes
      highestRewardTier: highest_reward_tier
      liquidityMultiplier: liquidity_multiplier
    }
  }
`;

const queryByUser24Hours = gql`
  query AirdropLeaderboard($address: String!) {
    airdrop_leaderboard: airdrop_leaderboard_24_hours(
      where: { address: { _eq: $address } }
      limit: 1
    ) {
      user: address
      rank
      referralCount: referral_count
      bottles: total_lootboxes
      highestRewardTier: highest_reward_tier
      liquidityMultiplier: liquidity_multiplier
    }
  }
`;

const query24Hours = gql`
  query AirdropLeaderboard {
    airdrop_leaderboard: airdrop_leaderboard_24_hours(
      limit: 16
      order_by: { total_lootboxes: desc }
    ) {
      user: address
      rank
      referralCount: referral_count
      bottles: total_lootboxes
      highestRewardTier: highest_reward_tier
      liquidityMultiplier: liquidity_multiplier
    }
  }
`;

const query24HoursByUserByApplication = gql`
  query AirdropLeaderboardApplication(
    $application: ethereum_application!
    $address: String!
  ) {
    airdrop_leaderboard: airdrop_leaderboard_24_hours_by_application(
      args: { application_: $application }
      where: { address: { _eq: $address } }
      limit: 1
    ) {
      user: address
      rank
      referralCount: referral_count
      bottles: total_lootboxes
      highestRewardTier: highest_reward_tier
      liquidityMultiplier: liquidity_multiplier
    }
  }
`;

const query24HoursByApplication = gql`
  query AirdropLeaderboardByApplication($application: ethereum_application!) {
    airdrop_leaderboard: airdrop_leaderboard_24_hours_by_application(
      args: { application_: $application }
      limit: 16
      order_by: { total_lootboxes: desc }
    ) {
      user: address
      rank
      referralCount: referral_count
      bottles: total_lootboxes
      highestRewardTier: highest_reward_tier
      liquidityMultiplier: liquidity_multiplier
    }
  }
`;

type AirdropLeaderboardBody = {
  query: string;
};

type AirdropLeaderboardByUserBody = AirdropLeaderboardBody & {
  variables: {
    address: string;
  };
};

type AirdropLeaderboardByApplicationBody = AirdropLeaderboardBody & {
  variables: {
    application: string;
  };
};

type AirdropLeaderboardByUserByApplicationBody = AirdropLeaderboardBody & {
  variables: {
    address: string;
    application: string;
  };
};

export type AirdropLeaderboardEntry = {
  user: string;
  rank: number;
  referralCount: number;
  bottles: number;
  highestRewardTier: number;
  liquidityMultiplier: number;
};

type AirdropLeaderboardResponse = {
  data?: {
    airdrop_leaderboard: Array<AirdropLeaderboardEntry>;
  };
  errors?: unknown;
};

export const useAirdropLeaderboardByUserAllTime = (address: string) => {
  const { url, headers } = fetchInternalEndpoint();

  const variables = {
    address,
  };
  const body = {
    query: queryByUserAllTime,
    variables,
  };

  return jsonPost<AirdropLeaderboardByUserBody, AirdropLeaderboardResponse>(
    url,
    body,
    headers
  );
};

export const useAirdropLeaderboardAllTime = () => {
  const { url, headers } = fetchInternalEndpoint();
  const body = {
    query: queryAllTime,
  };

  return jsonPost<AirdropLeaderboardBody, AirdropLeaderboardResponse>(
    url,
    body,
    headers
  );
};

export const useAirdropLeaderboardByUser24Hours = (address: string) => {
  const { url, headers } = fetchInternalEndpoint();

  const variables = {
    address,
  };
  const body = {
    query: queryByUser24Hours,
    variables,
  };

  return jsonPost<AirdropLeaderboardByUserBody, AirdropLeaderboardResponse>(
    url,
    body,
    headers
  );
};

export const useAirdropLeaderboard24Hours = () => {
  const { url, headers } = fetchInternalEndpoint();
  const body = {
    query: query24Hours,
  };

  return jsonPost<AirdropLeaderboardBody, AirdropLeaderboardResponse>(
    url,
    body,
    headers
  );
};

export const useAirdropLeaderboardByUserByApplication24Hours = (
  address: string,
  application: string
) => {
  const { url, headers } = fetchInternalEndpoint();

  const variables = {
    address,
    application,
  };
  const body = {
    query: query24HoursByUserByApplication,
    variables,
  };

  return jsonPost<
    AirdropLeaderboardByUserByApplicationBody,
    AirdropLeaderboardResponse
  >(url, body, headers);
};

export const useAirdropLeaderboardByApplication24Hours = (
  application: string
) => {
  const { url, headers } = fetchInternalEndpoint();
  const variables = {
    application,
  };
  const body = {
    query: query24HoursByApplication,
    variables,
  };

  return jsonPost<
    AirdropLeaderboardByApplicationBody,
    AirdropLeaderboardResponse
  >(url, body, headers);
};
