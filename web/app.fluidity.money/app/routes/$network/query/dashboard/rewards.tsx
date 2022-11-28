import type { Winner } from "~/queries/useUserRewards";
import type { UserTransaction } from "~/routes/$network/query/userTransactions";
import useGlobalRewardStatistics from "~/queries/useGlobalRewardStatistics";
import { JsonRpcProvider } from "@ethersproject/providers";
import RewardAbi from "~/util/chainUtils/ethereum/RewardPool.json";
import { getTotalPrizePool } from "~/util/chainUtils/ethereum/transaction";
import { LoaderFunction, json } from "@remix-run/node";
import { useUserRewardsAll } from "~/queries";
import config from "~/webapp.config.server";
import Transaction from "~/types/Transaction";
import { Provider } from "~/components/ProviderCard";

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

    const {
      transactions,
      count,
    }: { transactions: UserTransaction[]; count: number } = await (
      await fetch(
        `${url.origin}/${network}/query/userTransactions?page=${page}`
      )
    ).json();

    const { data, errors } = await useUserRewardsAll(network ?? "");

    if (errors || !data) {
      throw errors;
    }

    const winnersMap = data.winners.reduce(
      (map, winner) => ({
        ...map,
        [winner.transaction_hash]: {
          ...winner,
        },
      }),
      {} as { [key: string]: Winner }
    );

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

    const tokenLogoMap = tokens.reduce(
      (map, token) => ({
        ...map,
        [token.symbol]: token.logo,
      }),
      {} as Record<string, string>
    );

    const defaultLogo = "/assets/tokens/usdt.svg";

    const mergedTransactions: Transaction[] =
      transactions
        ?.filter((tx) => !!winnersMap[tx.hash])
        .map((tx) => {
          const winner = winnersMap[tx.hash];

          return {
            sender: tx.sender,
            receiver: tx.receiver,
            winner: winner.winning_address ?? "",
            reward: winner
              ? winner.winning_amount / 10 ** winner.token_decimals
              : 0,
            hash: tx.hash,
            currency: tx.currency,
            value:
              tx.currency === "DAI" || tx.currency === "fDAI"
                ? tx.value / 10 ** 12
                : tx.value,
            timestamp: tx.timestamp * 1000,
            logo: tokenLogoMap[tx.currency] || defaultLogo,
            provider:
              (network === "ethereum"
                ? winner.ethereum_application
                : winner.solana_application) ?? "Fluidity",
          };
        }) ?? [];

    const totalRewards = mergedTransactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    const { data: rewardData, errors: rewardErrors } =
      await useGlobalRewardStatistics(network ?? "");

    if (rewardErrors || !rewardData) {
      throw errors;
    }

    // group rewaObject.values(totalTransactions
    const totalRewarders = Object.values(
      mergedTransactions.reduce((map, tx) => {
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

    // Find highest Weekly Rewarder
    const unixNow = Date.now();

    const highestWeeklyRewarders = Object.values(
      mergedTransactions
        .filter(
          ({ timestamp }) => timestamp >= unixNow - 7 * 24 * 60 * 60 * 1000
        )
        .reduce((map, tx) => {
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
        avgPrizeA > avgPrizeB ? -1 : avgPrizeA === avgPrizeB ? 0 : 1
      );

    const highestWeeklyRewarder = highestWeeklyRewarders.length
      ? highestWeeklyRewarders[0]
      : undefined;

    const timestamp = new Date().getTime();

    return json({
      fluidTokenMap,
      highestWeeklyRewarder,
      page,
      network,
      fluidPairs,
      totalTransactions: mergedTransactions,
      totalCount: count,
      totalRewards,
      totalRewarders,
      totalPrizePool,
      networkFee,
      gasFee,
      timestamp,
    });
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Rewards on ${network}: ${err}`);
  } // Fail silently - for now.
};
