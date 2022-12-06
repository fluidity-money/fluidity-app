import type { Chain } from "~/util/chainUtils/chains";
import type { Volume } from "../volumeStats";
import type { Winner } from "~/queries/useUserRewards";

import { LoaderFunction, json } from "@remix-run/node";
import config from "~/webapp.config.server";
import { useUserRewardsAll, useUserRewardsByAddress } from "~/queries";
import { jsonGet } from "~/util/api/rpc";

export type HomeLoaderData = {
  rewards: Winner[];
  volume: Volume[];
  totalFluidPairs: number;
  network: Chain;
  timestamp: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  const timestamp = new Date().getTime();

  try {
    const [{ volume }, { data: rewardsData, errors: rewardsErr }] =
      await Promise.all([
        address
          ? jsonGet<{ address: string }, { volume: Volume[] }>(
              `${url.origin}/${network}/query/volumeStats`,
              {
                address,
              }
            )
          : jsonGet<Record<string, string>, { volume: Volume[] }>(
              `${url.origin}/${network}/query/volumeStats`
            ),
        address
          ? useUserRewardsByAddress(network ?? "", address)
          : useUserRewardsAll(network ?? ""),
      ]);

    if (!volume) {
      throw new Error("Could not fetch volume data");
    }

    if (rewardsErr || !rewardsData) {
      throw new Error("Could not fetch rewards data");
    }

    return json({
      rewards: rewardsData.winners,
      volume: volume,
      totalFluidPairs: fluidPairs,
      network,
      timestamp,
    } as HomeLoaderData);
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Transactions on ${network}: ${err}`);
  } // Fail silently - for now.
};
