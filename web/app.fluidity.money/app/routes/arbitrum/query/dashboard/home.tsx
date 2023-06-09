import type { TimeSepUserYield } from "~/queries/useUserYield";

import { LoaderFunction, json } from "@remix-run/node";
import { jsonGet } from "~/util";
import { useUserYieldAll, useUserYieldByAddress } from "~/queries";
import config from "~/webapp.config.server";
import { GraphData, useGraphData } from "~/queries/useGraphData";
import { ArbitrumVolume } from "../volumeStats";
import { Chain } from "~/util/chainUtils/chains";

export type HomeLoaderData = {
  rewards: TimeSepUserYield;
  volumeStats: ArbitrumVolume;
  graph: GraphData;
  totalFluidPairs: number;
  network: Chain;
  timestamp: number;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const network = "arbitrum";

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  const timestamp = new Date().getTime();

  try {
    const [
      { volume },
      { data: rewardsData, errors: rewardsErr },
      { data: graphData, errors: graphErr },
    ] = await Promise.all([
      address
        ? jsonGet<{ address: string }, { volume: ArbitrumVolume }>(
            `${url.origin}/${network}/query/volumeStats`,
            {
              address,
            }
          )
        : jsonGet<Record<string, never>, { volume: ArbitrumVolume }>(
            `${url.origin}/${network}/query/volumeStats`
          ),
      address
        ? useUserYieldByAddress(network ?? "", address)
        : useUserYieldAll(network ?? ""),
      useGraphData(network ?? ""),
    ]);

    if (!volume) {
      throw new Error("Could not fetch volume data");
    }

    if (rewardsErr || !rewardsData) {
      throw new Error("Could not fetch rewards data");
    }

    if (graphErr || !graphData) {
      throw new Error("Could not fetch graph data");
    }

    return json({
      rewards: rewardsData,
      graph: graphData,
      volumeStats: volume,
      totalFluidPairs: fluidPairs,
      network,
      timestamp,
      loaded: true,
    } satisfies HomeLoaderData);
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Transactions on ${network}: ${err}`);
  } // Fail silently - for now.
};
