import { JsonRpcProvider } from "@ethersproject/providers";
import RewardAbi from "~/util/chainUtils/ethereum/RewardPool.json";
import { getTotalPrizePool } from "~/util/chainUtils/ethereum/transaction";
import { LoaderFunction, json } from "@remix-run/node";
import config from "~/webapp.config.server";
import Transaction from "~/types/Transaction";
import { Provider } from "~/components/ProviderCard";
import useApplicationRewardStatistics from "~/queries/useApplicationRewardStatistics";
import { aggregateRewards } from "~/util/rewardAggregates";
import { jsonGet } from "~/util/api/rpc";

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";
  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  const networkFee = 0.002;
  const gasFee = 0.002;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

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

    const { transactions } = await jsonGet<
      { page: number },
      { transactions: Transaction[] }
    >(`${url.origin}/${network}/query/userTransactions`, {
      page,
    });

    const {
      config: {
        [network as string]: { tokens },
      },
    } = config;

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

    const totalRewards = transactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    // const { data: totalRewards, errors: totalRewardErr } = await useUserYieldAll(network ?? "");
    //
    // if (totalRewardErr || !totalRewards) {
    //   throw totalRewardErr;
    // }

    const { data: appRewardData, errors: appRewardErrors } =
      await useApplicationRewardStatistics(network ?? "");
    if (appRewardErrors || !appRewardData) {
      throw appRewardErrors;
    }

    const rewarders = aggregateRewards(appRewardData);

    const totalRewarders = Object.values(
      transactions.reduce((map, tx) => {
        const provider = map[tx.provider];

        return {
          ...map,
          [tx.provider]: provider
            ? {
                ...provider,
                count: provider.count + 1,
                prize: provider.prize + tx.reward,
              }
            : {
                name: tx.provider,
                count: 1,
                prize: tx.reward,
              },
        };
      }, {} as { [providerName: string]: { name: string; count: number; prize: number } })
    )
      .map(({ count, ...provider }) => ({
        ...provider,
        avgPrize: provider.prize / count,
      }))
      .sort(({ avgPrize: avgPrizeA }, { avgPrize: avgPrizeB }) =>
        avgPrizeA > avgPrizeB ? 1 : avgPrizeA === avgPrizeB ? 0 : -1
      ) as Provider[];

    return json({
      rewarders,
      fluidTokenMap,
      page,
      network,
      fluidPairs,
      totalTransactions: transactions,
      totalCount: transactions.length,
      totalRewards,
      totalRewarders,
      totalPrizePool,
      networkFee,
      gasFee,
      timestamp: new Date().getTime(),
    });
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Rewards on ${network}: ${err}`);
  } // Fail silently - for now.
};
