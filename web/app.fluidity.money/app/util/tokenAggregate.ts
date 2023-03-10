import {
  TokenReward,
  TokenRewardResponse,
} from "~/queries/useTokenRewardStatistics";

export type TokenPerformance = {
  week: TokenReward[];
  month: TokenReward[];
  year: TokenReward[];
  all: TokenReward[];
};

// aggregateRewards to transform reward data into the
// expected format and aggregate common applications
const aggregateTokens = (
  tokenData: TokenRewardResponse["data"]
): TokenPerformance => {
  const aggregatedRewarders = {
    week: aggregateTokenInterval(tokenData?.week),
    month: aggregateTokenInterval(tokenData?.month),
    year: aggregateTokenInterval(tokenData?.year),
    all: aggregateTokenInterval(tokenData?.all),
  };

  // convert to expected format using
  // Object.values on each interval
  const rewarders = Object.entries(aggregatedRewarders).reduce(
    (previous, [interval, value]) => ({
      ...previous,
      [interval]: Object.values(value || {}),
    }),
    {} as TokenPerformance
  );

  return rewarders;
};

const aggregateTokenInterval = (rewards?: TokenReward[]) =>
  rewards?.map(({ token, average_reward, highest_reward }) => ({
    token,
    avgPrize: average_reward,
    prize: highest_reward,
  }));

export { aggregateTokens };
