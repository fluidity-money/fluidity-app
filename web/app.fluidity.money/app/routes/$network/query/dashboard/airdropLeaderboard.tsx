import type { AirdropLeaderboardEntry } from "~/queries/useAirdropLeaderboard";

import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import {
  useAirdropLeaderboardAllTime,
  useAirdropLeaderboardByUser,
} from "~/queries/useAirdropLeaderboard";

export type AirdropLeaderboardLoaderData = {
  leaderboard: Array<AirdropLeaderboardEntry>;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  if (!network) throw new Error("Invalid Request");

  try {
    const { data: leaderboardData, errors: leaderboardErrors } = await (address
      ? useAirdropLeaderboardByUser(address)
      : useAirdropLeaderboardAllTime());

    if (!leaderboardData) throw leaderboardErrors;

    const { airdrop_leaderboard: leaderboard } = leaderboardData;

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
