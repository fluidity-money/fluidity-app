import type { AirdropLeaderboardEntry } from "~/queries/useAirdropLeaderboard";

import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import {
  useAirdropLeaderboardAllTime,
  useAirdropLeaderboard24Hours,
  useAirdropLeaderboardByApplication24Hours,
} from "~/queries/useAirdropLeaderboard";

export type AirdropLeaderboardLoaderData = {
  leaderboard: Array<AirdropLeaderboardEntry>;
  loaded: boolean;
};

const AIRDROP_PROVIDERS = new Set(["chronos", "sushiswap"]);

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);

  const epoch = url.searchParams.get("epoch");

  if (!epoch) throw new Error("Invalid Request");

  const address = url.searchParams.get("address") ?? "";
  const period = url.searchParams.get("period") ?? "";
  const provider_ = url.searchParams.get("provider") ?? "";
  const use24Hours = period === "24";
  const useAll = period === "all";

  const provider = AIRDROP_PROVIDERS.has(provider_) ? provider_ : "";

  if (!network) throw new Error("Invalid Request");
  if (!use24Hours && !useAll) throw new Error("Invalid Request");

  try {
    const [useAllQuery] = (() => {
      switch (true) {
        case useAll: {
          return [() => useAirdropLeaderboardAllTime(epoch)];
        }
        case use24Hours && !!provider: {
          return [
            () => useAirdropLeaderboardByApplication24Hours(epoch, provider),
          ];
        }
        case use24Hours && !provider:
        default: {
          return [() => useAirdropLeaderboard24Hours(epoch)];
        }
      }
    })();

    const { data: globalLeaderboardData, errors: globalLeaderboardErrors } =
      await useAllQuery();

    if (!globalLeaderboardData || globalLeaderboardErrors)
      throw globalLeaderboardErrors;

    const leaderboard = globalLeaderboardData.airdrop_leaderboard.map(
      (leaderboardRow, i) => ({
        ...leaderboardRow,
        rank: i + 1,
      })
    );

    if (
      !address ||
      leaderboard.find(({ user: rowAddress }) => rowAddress === address)
    ) {
      return json({
        leaderboard,
        loaded: true,
      } satisfies AirdropLeaderboardLoaderData);
    }

    return json({
      leaderboard,
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
