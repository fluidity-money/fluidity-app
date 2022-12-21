import { captureException } from "@sentry/react";
import { useEffect, useState } from "react";
import { useUserUnclaimedRewards } from "~/queries";
import { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";

export type TokenUnclaimedReward = {
  symbol: string;
  reward: number;
};

export const getUnclaimedRewards = (address: string, network: string) => {
  const [
    { userUnclaimedRewards, unclaimedTxs, unclaimedTokens },
    setUnclaimedRewardsRes,
  ] = useState<{
    unclaimedTxs: UserUnclaimedReward[];
    unclaimedTokens: TokenUnclaimedReward[];
    userUnclaimedRewards: number;
  }>({
    unclaimedTxs: [],
    unclaimedTokens: [],
    userUnclaimedRewards: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await useUserUnclaimedRewards(
          network,
          address ?? ""
        );

        if (!data || error) return;

        const { ethereum_pending_winners: rewards } = data;

        const userUnclaimedRewards = rewards.reduce((sum, transaction) => {
          const { win_amount, token_decimals } = transaction;

          const decimals = 10 ** token_decimals;
          return sum + win_amount / decimals;
        }, 0);

        const unclaimedTokens = Object.entries(
          rewards.reduce((map, transaction) => {
            const { win_amount, token_decimals, token_short_name } =
              transaction;
            const reward =
              (map[token_short_name] ?? 0) + win_amount / 10 ** token_decimals;

            return {
              ...map,
              [token_short_name]: reward,
            };
          }, {} as { [tokenName: string]: number })
        ).map(([symbol, reward]) => ({ symbol, reward }));

        setUnclaimedRewardsRes({
          unclaimedTxs: rewards,
          unclaimedTokens: unclaimedTokens,
          userUnclaimedRewards,
        });
        setLoading(false);
      } catch (err) {
        captureException(
          new Error(
            `Could not fetch Transactions count for ${address}, on ${network}`
          ),
          {
            tags: {
              section: "dashboard",
            },
          }
        );
        return;
      }
    })();
  }, [address, network]);
  return {
    userUnclaimedRewards,
    unclaimedTxs,
    unclaimedTokens,
    loading,
  };
};
