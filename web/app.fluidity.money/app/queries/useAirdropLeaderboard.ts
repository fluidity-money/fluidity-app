import { AirdropLeaderboardEntry } from "~/routes/$network/query/airdrop";
import { jsonPost, gql, fetchInternalEndpoint } from "~/util";

const queryByUser = gql`
  query AirdropLeaderboard($address: String!) {
    airdrop_leaderboard(wherer: { address: { _eq: $address } }, limit: 1) {
      address
      rank
      referral_count
      total_lootboxes
      highest_reward_tier
      liquidity_multiplier
    }
  }
`;

const queryAllTime = gql`
  query AirdropLeaderboard() {
    airdrop_leaderboard(
      limit: 16
    ) {
      address: user
      rank
      referral_count: referralCount
      total_lootboxes: bottles
      highest_reward_tier: highestRewardTier
      liquidity_multiplier: liquidityMultiplier
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

type AirdropLeaderboardResponse = {
  data?: {
    leaderboard: Array<AirdropLeaderboardEntry>;
  };
  errors?: unknown;
};

export const useAirdropLeaderboardByUser = (address: string) => {
  const { url, headers } = fetchInternalEndpoint();
  const variables = {
    address,
  };
  const body = {
    query: queryByUser,
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
