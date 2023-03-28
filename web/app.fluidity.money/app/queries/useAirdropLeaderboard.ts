import {AirdropLeaderboardEntry} from "~/routes/$network/query/airdrop";
import {jsonPost, gql} from "~/util";

const queryAirdropLeaderboard = gql`
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

export const useAirdropLeaderboard = async () => {
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    query: queryAirdropLeaderboard,
  };

  return await jsonPost<ExpectedAirdropLeaderboardBody, ExpectedAirdropLeaderboardResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
}

type ExpectedAirdropLeaderboardBody = {
  query: string;
}

type ExpectedAirdropLeaderboardResponse = {
  data?: {
    leaderboard: Array<AirdropLeaderboardEntry>;
  }
  errors?: unknown
}
