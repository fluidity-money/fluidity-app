import type { AirdropLeaderboardEntry } from "~/queries/useAirdropLeaderboard";

import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import {
  useAirdropLeaderboardAllTime,
  useAirdropLeaderboardByUserAllTime,
  useAirdropLeaderboard24Hours,
  useAirdropLeaderboardByUser24Hours,
} from "~/queries/useAirdropLeaderboard";

export type AirdropLeaderboardLoaderData = {
  leaderboard: Array<AirdropLeaderboardEntry>;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address") ?? "";
  const period = url.searchParams.get("period") ?? "";
  const use24Hours = period === "24";
  const useAll = period === "all";

  if (!network) throw new Error("Invalid Request");
  if (!use24Hours && !useAll) throw new Error("Invalid Request");

  try {
    const { data: globalLeaderboardData, errors: globalLeaderboardErrors } =
      await (async () => {
        switch (useAll) {
          case true: {
            const res = await useAirdropLeaderboardAllTime();
            return { ...res, data: res.data?.airdrop_leaderboard };
          }
          case false:
          default: {
            const res = await useAirdropLeaderboard24Hours();
            return { ...res, data: res.data?.airdrop_leaderboard_24_hours };
          }
        }
      })();

    if (!globalLeaderboardData || globalLeaderboardErrors)
      throw globalLeaderboardErrors;

    const leaderboard = globalLeaderboardData.map((leaderboardRow, i) => ({
      ...leaderboardRow,
      rank: i + 1,
    }));

    if (
      !address ||
      leaderboard.find(({ user: rowAddress }) => rowAddress === address)
    ) {
      return json({
        leaderboard,
        loaded: true,
      } satisfies AirdropLeaderboardLoaderData);
    }

    const { data: userLeaderboardData, errors: userLeaderboardErrors } =
      await (async () => {
        switch (useAll) {
          case true: {
            const res = await useAirdropLeaderboardByUserAllTime(address);
            return { ...res, data: res.data?.airdrop_leaderboard };
          }
          case false:
          default: {
            const res = await useAirdropLeaderboardByUser24Hours(address);
            return { ...res, data: res.data?.airdrop_leaderboard_24_hours };
          }
        }
      })();

    if (!userLeaderboardData || userLeaderboardErrors)
      throw userLeaderboardErrors;

    const jointLeaderboardData = (
      userLeaderboardData.length
        ? userLeaderboardData.map((e) => ({ ...e, rank: -1 }))
        : [
            {
              user: address,
              rank: -1,
              liquidityMultiplier: 0,
              referralCount: 0,
              bottles: 0,
              highestRewardTier: 0,
            } satisfies AirdropLeaderboardEntry,
          ]
    ).concat(leaderboard);

    return json({
      leaderboard: jointLeaderboardData,
      loaded: true,
    } satisfies AirdropLeaderboardLoaderData);
  } catch (err) {
    captureException(new Error(`Could not fetch airdrop data: ${err}`), {
      tags: {
        section: "network/index",
      },
    });
    return new Error("Server could not fulfill request");
  }
};
