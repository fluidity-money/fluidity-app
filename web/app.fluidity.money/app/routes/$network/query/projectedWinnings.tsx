import type { HighestRewardMonthly } from "~/queries/useHighestRewardStatistics";

import { LoaderFunction, json } from "@remix-run/node";
import { useHighestRewardStatisticsByNetwork } from "~/queries/useHighestRewardStatistics";
import { captureException } from "@sentry/react";

export type HighestRewardsData = {
  highestRewards: HighestRewardMonthly[],
};

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  try {
    const { data: highestRewardsData, errors: highestRewardsErr } =
      await useHighestRewardStatisticsByNetwork(network ?? "")

    if (highestRewardsErr || !highestRewardsData) {
      throw highestRewardsErr
    }

    return json({
      highestRewards: highestRewardsData.highest_rewards_monthly,
    } as HighestRewardsData);
  } catch (err) {
    captureException(
      new Error(
        `Could not fetch historical rewards: ${err}`
      ),
      {
        tags: {
          section: "network/index",
        },
      }
    );
    return new Error("Server could not fulfill request");
  }
};
