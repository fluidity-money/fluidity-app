import type { LoaderFunction } from "@remix-run/node";
import type { TradingLeaderboardEntry } from "~/queries/useTradingCompLeaderboard";

import { json } from "@remix-run/node";
import { useCurrentRewardEpoch } from "~/queries";
import {
  useTradingCompLeaderboardAll,
  useTradingCompLeaderboardByUser,
} from "~/queries";

export type TradingCompLeaderboardLoaderData = {
  leaderboard: Array<TradingLeaderboardEntry & { rank: number }>;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const url = new URL(request.url);

  const address_ = url.searchParams.get("address") ?? "";

  const address = address_.toLocaleLowerCase();

  if (!network) throw new Error("Invalid Request");

  try {
    const { data: currentEpochData, errors: currentEpochErr } =
      await useCurrentRewardEpoch();

    if (!currentEpochData || currentEpochErr) throw currentEpochErr;

    const {
      start: start_,
      end: end_,
      application,
    } = currentEpochData.reward_epochs[0];

    const start = new Date(start_);
    const end = new Date(end_);

    const { data: tradingCompData, errors: tradingCompErr } =
      await useTradingCompLeaderboardAll(network, start, end, application);

    if (!tradingCompData || tradingCompErr) throw tradingCompErr;

    const leaderboard = tradingCompData.trading_leaderboard.map((row, i) => ({
      ...row,
      rank: i + 1,
    }));

    if (
      !address ||
      leaderboard.find(({ address: rowAddress }) => rowAddress === address)
    ) {
      return json({
        leaderboard,
        loaded: true,
      } satisfies TradingCompLeaderboardLoaderData);
    }

    const { data: userTradingCompData, errors: userTradingCompErr } =
      await useTradingCompLeaderboardByUser(
        network,
        start,
        end,
        address,
        application
      );

    if (!userTradingCompData || userTradingCompErr) throw userTradingCompErr;

    const jointLeaderboardData = (
      userTradingCompData.trading_leaderboard.length
        ? userTradingCompData.trading_leaderboard.map((e) => ({
            ...e,
            rank: -1,
          }))
        : [
            {
              address,
              volume: 0,
              rank: -1,
            },
          ]
    ).concat(leaderboard);

    return json({
      leaderboard: jointLeaderboardData,
      loaded: true,
    } satisfies TradingCompLeaderboardLoaderData);
  } catch (e) {
    throw e;
  }
};
