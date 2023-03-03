import type { AssetPrize } from "~/queries/useAssetStatistics";
import type { TransactionsLoaderData } from "../../userTransactions";

import { LoaderFunction } from "react-router-dom";
import useAssetStatistics from "~/queries/useAssetStatistics";
import { jsonGet } from "~/util";
import {
  getTokenFromAddress,
  getTokenFromSymbol,
} from "~/util/chainUtils/tokens";
import { json } from "@remix-run/node";

export type AssetActivity = {
  desc: string;
  value: number;
  reward: number;
  transaction: string;
  time: number;
};

export type AssetLoaderData = {
  topPrize: AssetPrize;
  avgPrize: number;
  topAssetPrize: AssetPrize;
  activity: Array<AssetActivity>;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const token = url.searchParams.get("token");

  const network = params.network as string;

  if (!address) throw new Error("address is required");
  if (!token) throw new Error("token is required");

  const fluidToken = getTokenFromSymbol(network, token);

  if (!fluidToken) throw new Error("Couldn't find token");

  const fluidTokenAddr = fluidToken.address;

  const regularTokenAddr = fluidToken?.isFluidOf;

  if (!regularTokenAddr) throw new Error("Couldn't find token");

  const regularSymbol = getTokenFromAddress(network, regularTokenAddr)?.symbol;

  if (!regularSymbol) throw new Error("Couldn't find regular token symbol");

  const [assetStatistics, activity] = await Promise.all([
    useAssetStatistics(network, regularSymbol, address),
    jsonGet<
      { page: number; address: string; token: string },
      TransactionsLoaderData
    >(`${url.origin}/${network}/query/userTransactions`, {
      page: 1,
      address,
      token: fluidTokenAddr,
    }),
  ]);

  if (!assetStatistics.data) throw new Error("Couldn't fetch asset data.");
  if (!activity) throw new Error("Couldn't fetch activity data.");

  const parsedActivity = activity.transactions?.map((tx) => {
    const desc = tx.sender === address ? "Sent" : "Received";
    const value = tx.value;
    const reward = tx.reward;
    const transaction = tx.hash;
    const time = tx.timestamp;

    return { desc, value, reward, transaction, time };
  });

  const topPrize = assetStatistics.data.user.aggregate.max;
  const avgPrize = assetStatistics.data.user.aggregate.avg.winning_amount;
  const topAssetPrize = assetStatistics.data.global.aggregate.max;

  return json({
    topPrize,
    avgPrize,
    topAssetPrize,
    activity: parsedActivity,
    loaded: true,
  } satisfies AssetLoaderData);
};
