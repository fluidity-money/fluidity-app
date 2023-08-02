import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useCurrentRewardEpoch } from "~/queries";

export type RewardEpochLoaderData = {
  id: number;
  start: string;
  end: string;
  application?: string;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ params }) => {
  const network = params.network ?? "";

  if (!network) throw new Error("Invalid Request");

  try {
    const { data: currentEpochData, errors: currentEpochErr } =
      await useCurrentRewardEpoch();

    if (!currentEpochData || currentEpochErr) throw currentEpochErr;

    const { id, start, end, application } = currentEpochData.reward_epochs[0];

    return json({
      id,
      start,
      end,
      application,
      loaded: true,
    } satisfies RewardEpochLoaderData);
  } catch (e) {
    throw e;
  }
};
