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
    airdrop_leaderboard_24_hours(
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
    airdrop_leaderboard_24_hours(
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

type AirdropLeaderboard24HoursResponse = {
  data?: {
    airdrop_leaderboard_24_hours: Array<AirdropLeaderboardEntry>;
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

  return jsonPost<
    AirdropLeaderboardByUserBody,
    AirdropLeaderboard24HoursResponse
  >(url, body, headers);
};

export const useAirdropLeaderboard24Hours = () => {
  const { url, headers } = fetchInternalEndpoint();
  const body = {
    query: query24Hours,
  };

  return jsonPost<AirdropLeaderboardBody, AirdropLeaderboard24HoursResponse>(
    url,
    body,
    headers
  );
};
