import type { Chain } from "~/util/chainUtils/chains";
import type { LoaderFunction } from "@remix-run/node";
import type { Rewarders } from "~/util/rewardAggregates";

import { JsonRpcProvider } from "@ethersproject/providers";
import { getTotalPrizePool } from "~/util/chainUtils/ethereum/transaction";
import { json } from "@remix-run/node";
import useApplicationRewardStatistics from "~/queries/useApplicationRewardStatistics";
import { aggregateRewards } from "~/util/rewardAggregates";
import { useUserRewardsAll, useUserRewardsByAddress } from "~/queries";
import RewardAbi from "~/util/chainUtils/ethereum/RewardPool.json";
import config from "~/webapp.config.server";

export type RewardsLoaderData = {
  network: Chain;
  rewarders: Rewarders;
  fluidTokenMap: { [symbol: string]: string };
  fluidPairs: number;
  totalRewards: number;
  totalPrizePool: number;
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

    const totalPrizePool = await getTotalPrizePool(
      provider,
      rewardPoolAddr,
      RewardAbi
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
      {}
    );

    const { data: winnersData } = await (address
      ? useUserRewardsByAddress(network, address)
      : useUserRewardsAll(network));

    const totalRewards = winnersData?.winners.reduce(
      (sum, { winning_amount, token_decimals }) =>
        sum + winning_amount / 10 ** token_decimals,
      0
    );

    const { data: appRewardData, errors: appRewardErrors } =
      await useApplicationRewardStatistics(network ?? "");

    if (appRewardErrors || !appRewardData) {
      throw appRewardErrors;
    }

    const rewarders = aggregateRewards(appRewardData);

    return json({
      network,
      rewarders,
      fluidTokenMap,
      fluidPairs,
      totalRewards,
      totalPrizePool,
      networkFee,
      gasFee,
      timestamp: new Date().getTime(),
    } as RewardsLoaderData);
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Rewards on ${network}: ${err}`);
  } // Fail silently - for now.
};
