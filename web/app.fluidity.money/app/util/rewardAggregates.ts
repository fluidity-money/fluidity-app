import { getProviderDisplayName } from "~/util/provider";
import { Provider } from "@fluidity-money/surfing";
import {
  ApplicationReward,
  ApplicationRewardResponse,
} from "~/queries/useApplicationRewardStatistics";
import { Chain } from "./chainUtils/chains";

type ProviderWithRewards = {
  name: Provider;
  prize: number;
  avgPrize: number;
};

export type Rewarders = {
  week: ProviderWithRewards[];
  month: ProviderWithRewards[];
  year: ProviderWithRewards[];
  all: ProviderWithRewards[];
};

// aggregateRewards to transform reward data into the
// expected format and aggregate common applications
const aggregateRewards = (
  rewardData: ApplicationRewardResponse<Chain>["data"]
): Rewarders => {
  const aggregatedRewarders = {
    week: aggregateRewardInterval(rewardData?.week),
    month: aggregateRewardInterval(rewardData?.month),
    year: aggregateRewardInterval(rewardData?.year),
    all: aggregateRewardInterval(rewardData?.all),
  };

  // convert to expected format using
  // Object.values on each interval
  const rewarders = Object.entries(aggregatedRewarders).reduce(
    (previous, [interval, value]) => ({
      ...previous,
      [interval]: Object.values(value || {}),
    }),
    {} as Rewarders
  );

  return rewarders;
};

const aggregateRewardInterval = (rewards?: ApplicationReward<Chain>[]) =>
  rewards
    ?.map((reward) => ({
      name: getProviderDisplayName(reward.application),
      avgPrize: reward.average_reward,
      prize: reward.highest_reward,
    }))
    .filter((reward) => reward.name !== undefined)
    // reduce where name is the same, e.g. oneinch_v1 and oneinch_v2
    .reduce((previous, currentApp) => {
      const { name, prize, avgPrize } = currentApp;

      // append to name if it exists
      if (previous[name]) {
        previous[name].avgPrize += avgPrize;
        // max prize
        previous[name].prize = Math.max(previous[name].prize, prize);
        // set name if it doesn't exist
      } else {
        previous[name] = {
          name,
          prize,
          avgPrize,
        };
      }
      return previous;
    }, {} as { [K in Provider]: ProviderWithRewards });

export { aggregateRewards };
