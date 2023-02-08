import type { Chain } from "~/util/chainUtils/chains";
import type { LoaderFunction } from "@remix-run/node";
import type { Rewarders } from "~/util/rewardAggregates";
import type { TokenPerformance } from "~/util/tokenAggregate";

import { JsonRpcProvider } from "@ethersproject/providers";
import { getTotalPrizePool } from "~/util/chainUtils/ethereum/transaction";
import { json } from "@remix-run/node";
import useApplicationRewardStatistics from "~/queries/useApplicationRewardStatistics";
import { aggregateRewards } from "~/util/rewardAggregates";
import { aggregateTokens } from "~/util/tokenAggregate";
import RewardAbi from "~/util/chainUtils/ethereum/RewardPool.json";
import config from "~/webapp.config.server";
import {
  TimeSepUserYield,
  useUserYieldAll,
  useUserYieldByAddress,
} from "~/queries/useUserYield";
import { useTokenRewardStatistics } from "~/queries";

export type RewardsLoaderData = {
  network: Chain;
  rewarders: Rewarders;
  rewards: TimeSepUserYield;
  fluidTokenMap: { [symbol: string]: string };
  fluidPairs: number;
  totalPrizePool: number;
  tokenPerformance: TokenPerformance;
  networkFee: number;
  gasFee: number;
  timestamp: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";
  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  const networkFee = 0.002;
  const gasFee = 0.002;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  try {
    const mainnetId = 0;
    const infuraRpc = config.drivers["ethereum"][mainnetId].rpc.http;

    const provider = new JsonRpcProvider(infuraRpc);

    const rewardPoolAddr = "0xD3E24D732748288ad7e016f93B1dc4F909Af1ba0";

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
      {}
    );

    const [
      totalPrizePool,
      { data: rewardsData, errors: rewardsErr },
      { data: appRewardData, errors: appRewardErrors },
      { data: tokenRewardData, errors: tokenRewardErrors },
    ] = await Promise.all([
      getTotalPrizePool(provider, rewardPoolAddr, RewardAbi),
      address
        ? useUserYieldByAddress(network, address)
        : useUserYieldAll(network),
      useApplicationRewardStatistics(network ?? ""),
      useTokenRewardStatistics(network ?? ""),
    ]);

    if (rewardsErr || !rewardsData) {
      throw rewardsErr;
    }

    if (tokenRewardErrors || !tokenRewardData) {
      throw tokenRewardErrors;
    }

    if (appRewardErrors || !appRewardData) {
      throw appRewardErrors;
    }

    const rewarders = aggregateRewards(appRewardData);

    const tokenPerformance = aggregateTokens(tokenRewardData);

    return json({
      network,
      rewarders,
      rewards: rewardsData,
      fluidTokenMap,
      fluidPairs,
      totalPrizePool,
      networkFee,
      gasFee,
      tokenPerformance,
      timestamp: new Date().getTime(),
    } as RewardsLoaderData);
  } catch (err) {
    throw new Error(`Could not fetch Rewards on ${network}: ${err}`);
  } // Fail silently - for now.
};
