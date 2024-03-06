import { json } from "react-router-dom";
import config from "~/webapp.config.server";
import TotalRewardPoolAbi from "~/util/chainUtils/ethereum/getTotalRewardPool.json";
import { getTotalRewardPool } from "~/util/chainUtils/ethereum/transaction";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Chain } from "~/util/chainUtils/chains";

export async function loader() {
  const mainnetId = 0;

  const prizePoolPromise: Promise<number> = (() => {
    return Promise.resolve(
      Promise.all(
        [
          {
            network: "arbitrum",
            abi: TotalRewardPoolAbi,
            getPrizePool: getTotalRewardPool,
          },
        ].map(({ network, abi, getPrizePool }) => {
          const infuraRpc = config.drivers[network][mainnetId].rpc.http;
          const provider = new JsonRpcProvider(infuraRpc);

          const rewardPoolAddr = config.contract.prize_pool[network as Chain];

          return getPrizePool(provider, rewardPoolAddr, abi);
        })
      ).then((prizePools) =>
        prizePools.reduce((sum, prizePool) => sum + prizePool, 0)
      )
    );
  })();

  return json({ totalPrizePool: await prizePoolPromise });
}
