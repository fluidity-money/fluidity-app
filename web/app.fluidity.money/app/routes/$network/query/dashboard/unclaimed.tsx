import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useUserUnclaimedRewards, useUserRewardsByAddress } from "~/queries";
import { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";

export type TokenUnclaimedReward = {
  symbol: string;
  reward: number;
};

export type UnclaimedLoaderData = {
  unclaimedTxs: UserUnclaimedReward[];
  unclaimedTokens: TokenUnclaimedReward[];
  userUnclaimedRewards: number;
  userClaimedRewards: number;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  if (!address) return;

  try {
    const [
      { data: userRewardsData, errors: userRewardsErr },
      { data: userUnclaimedRewardsData, error: userUnclaimedRewardsErr },
    ] = await Promise.all([
      useUserRewardsByAddress(network, address),
      useUserUnclaimedRewards(network, address),
    ]);

    if (!userUnclaimedRewardsData || userUnclaimedRewardsErr)
      throw userUnclaimedRewardsErr;

    if (!userRewardsData || userRewardsErr) throw userRewardsErr;

    const { ethereum_pending_winners: rewards } = userUnclaimedRewardsData;

    const fluidRewards = rewards.map(({ token_short_name, ...token }) => ({
      ...token,
      token_short_name: `f${token_short_name}`,
    }));

    const userUnclaimedRewards = rewards.reduce((sum, transaction) => {
      const { win_amount, token_decimals } = transaction;

      const decimals = 10 ** token_decimals;
      return sum + win_amount / decimals;
    }, 0);

    const unclaimedTokens = Object.entries(
      rewards.reduce((map, transaction) => {
        const { win_amount, token_decimals, token_short_name } = transaction;
        const reward =
          (map[token_short_name] ?? 0) + win_amount / 10 ** token_decimals;

        return {
          ...map,
          [`f${token_short_name}`]: reward,
        };
      }, {} as { [tokenName: string]: number })
    ).map(([symbol, reward]) => ({ symbol, reward }));

    const { winners } = userRewardsData;

    const userClaimedRewards = winners.reduce(
      (sum, { winning_amount, token_decimals }) =>
        sum + winning_amount / 10 ** token_decimals,
      0
    );

    return json({
      unclaimedTxs: fluidRewards,
      unclaimedTokens: unclaimedTokens,
      userUnclaimedRewards,
      userClaimedRewards,
      loaded: true,
    } satisfies UnclaimedLoaderData);
  } catch (err) {
    throw new Error(`Could not fetch Unclaimed Rewards on ${network}: ${err}`);
  }
};
