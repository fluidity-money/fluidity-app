import { Chain, chainType } from "~/util/chainUtils/chains";
import type { Volume } from "../volumeStats";
import type { TimeSepUserYield } from "~/queries/useUserYield";

import { JsonRpcProvider } from "@ethersproject/providers";
import { LoaderFunction, json } from "@remix-run/node";
import { jsonGet } from "~/util";
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
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = (params.network ?? "") as Chain;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  const timestamp = new Date().getTime();

  const mainnetId = 0;

  const prizePoolPromise: Promise<number> = (() => {
    switch (chainType(network)) {
      case "evm": {
        return Promise.resolve(
          Promise.all(
            ["ethereum", "arbitrum"].map((network) => {
              const infuraRpc = config.drivers[network][mainnetId].rpc.http;
              const provider = new JsonRpcProvider(infuraRpc);

              const rewardPoolAddr =
                config.contract.prize_pool[network as Chain];

              return getTotalPrizePool(provider, rewardPoolAddr, RewardAbi);
            })
          ).then((prizePools) =>
            prizePools.reduce((sum, prizePool) => sum + prizePool, 0)
          )
        );
      }
      default:
        return Promise.resolve(0);
    }
  })();

  try {
    const [
      totalPrizePool,
      { volume },
      { data: rewardsData, errors: rewardsErr },
    ] = await Promise.all([
      prizePoolPromise,
      address
        ? jsonGet<{ address: string }, { volume: Volume[] }>(
            `${url.origin}/${network}/query/volumeStats`,
            {
              address,
            }
          )
        : jsonGet<Record<string, never>, { volume: Volume[] }>(
            `${url.origin}/${network}/query/volumeStats`
          ),
      address
        ? useUserYieldByAddress(network ?? "", address)
        : useUserYieldAll(network ?? ""),
    ]);

    if (!volume) {
      throw new Error("Could not fetch volume data");
    }

    if (rewardsErr || !rewardsData) {
      throw new Error("Could not fetch rewards data");
    }

    return json({
      totalPrizePool,
      rewards: rewardsData,
      volume: volume,
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
