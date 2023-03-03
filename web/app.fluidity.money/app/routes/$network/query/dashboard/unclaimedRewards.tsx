import type { LoaderFunction } from "@remix-run/node";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";

import { json } from "@remix-run/node";
import { useUserUnclaimedRewards } from "~/queries";
import config from "~/webapp.config.server";

export type UnclaimedRewardsLoaderData = {
  userUnclaimedRewards: number;
  unclaimedTokenAddrs: string[];
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  if (!address) throw new Error("Invalid Request");

  try {
    const { data, error } = await useUserUnclaimedRewards(
      network,
      address ?? ""
    );

    if (!data || error) return;

    const { ethereum_pending_winners: rewards } = data;

    const sanitisedRewards = rewards.filter(
      (transaction: UserUnclaimedReward) => !transaction.reward_sent
    );

    const userUnclaimedRewards = sanitisedRewards.reduce(
      (sum: number, transaction: UserUnclaimedReward) => {
        const { win_amount, token_decimals } = transaction;

        const decimals = 10 ** token_decimals;
        return sum + win_amount / decimals;
      },
      0
    );

    const { tokens } = config.config[network];

    const fluidTokenMap = tokens.reduce(
      (map, token) =>
        token.isFluidOf
          ? {
              ...map,
              [token.symbol]: token.address,
              [token.symbol.slice(1)]: token.address,
            }
          : map,
      {} as { [symbol: string]: string }
    );

    const unclaimedTokenAddrs = Array.from(
      new Set(sanitisedRewards.map(({ token_short_name }) => token_short_name))
    ).map((name) => fluidTokenMap[name] ?? "");

    return json({
      userUnclaimedRewards,
      unclaimedTokenAddrs,
    } as UnclaimedRewardsLoaderData);
  } catch (err) {
    console.log(err);
    throw new Error(
      `Could not fetch User Unclaimed Rewards on ${network}: ${err}`
    );
  } // Fail silently - for now.
};
