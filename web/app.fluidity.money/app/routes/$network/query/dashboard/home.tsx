import type { Chain } from "~/util/chainUtils/chains";
import type { Volume } from "../volumeStats";
import type { TimeSepUserYield } from "~/queries/useUserYield";

import { JsonRpcProvider } from "@ethersproject/providers";
import { LoaderFunction, json } from "@remix-run/node";
// import { jsonGet } from "~/util";
import { useUserYieldAll, useUserYieldByAddress } from "~/queries";
import { getTotalPrizePool } from "~/util/chainUtils/ethereum/transaction";
import RewardAbi from "~/util/chainUtils/ethereum/RewardPool.json";
import config from "~/webapp.config.server";

export type HomeLoaderData = {
  totalPrizePool: number;
  rewards: TimeSepUserYield;
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

  const mainnetId = 0;
  const infuraRpc = config.drivers["ethereum"][mainnetId].rpc.http;

  const provider = new JsonRpcProvider(infuraRpc);

  const rewardPoolAddr = "0xD3E24D732748288ad7e016f93B1dc4F909Af1ba0";

  try {
    const [
      totalPrizePool,
      /*{ volume }*/,
      { data: rewardsData, errors: rewardsErr },
    ] = await Promise.all([
      getTotalPrizePool(provider, rewardPoolAddr, RewardAbi),
      // address
      //   ? jsonGet<{ address: string }, { volume: Volume[] }>(
      //       `${url.origin}/${network}/query/volumeStats`,
      //       {
      //         address,
      //       }
      //     )
      //   : jsonGet<Record<string, string>, { volume: Volume[] }>(
      //       `${url.origin}/${network}/query/volumeStats`
      //     ),
      async () => { return {}; },
      address
        ? useUserYieldByAddress(network ?? "", address)
        : useUserYieldAll(network ?? ""),
    ]);

    // if (!volume) {
    //   throw new Error("Could not fetch volume data");
    // }

    if (rewardsErr || !rewardsData) {
      throw new Error("Could not fetch rewards data");
    }

    return json({
      totalPrizePool,
      rewards: rewardsData,
      //volume: volume,
      totalFluidPairs: fluidPairs,
      network,
      timestamp,
    } as HomeLoaderData);
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Transactions on ${network}: ${err}`);
  } // Fail silently - for now.
};
