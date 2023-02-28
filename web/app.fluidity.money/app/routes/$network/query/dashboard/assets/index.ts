import type { TransactionsLoaderData } from "../../userTransactions";

import BN from "bn.js";
import { LoaderFunction } from "react-router-dom";
import { useUserTransactionsByAddress } from "~/queries";
import useAssetStatistics from "~/queries/useAssetStatistics";
import { jsonGet } from "~/util";
import {
  getTokenFromAddress,
  getTokenFromSymbol,
  Token,
} from "~/util/chainUtils/tokens";

export type ITokenHeader = {
  token: Token;
  fluidAmt: BN;
  regAmt: BN;
  value: number;
  topPrize: {
    winning_amount: number;
    transaction_hash: string;
  };
  avgPrize: number;
  topAssetPrize: {
    winning_amount: number;
    transaction_hash: string;
  };
  activity: {
    desc: string;
    value: number;
    reward: number;
    transaction: string;
    time: number;
  }[];
};

export type ITokenStatistics = Omit<
  ITokenHeader,
  "token" | "fluidAmt" | "regAmt" | "value"
>;

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<ITokenStatistics> => {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const token = url.searchParams.get("token");

  const network = params.network as string;

  if (!address) throw new Error("address is required");
  if (!token) throw new Error("token is required");

  const regularToken = getTokenFromSymbol(network, token)?.isFluidOf;

  if (!regularToken) throw new Error("Couldn't find regular token");

  const regularSymbol = getTokenFromAddress(network, regularToken)?.symbol;

  if (!regularSymbol) throw new Error("Couldn't find regular token symbol");

  const [assetStatistics, activity] = await Promise.all([
    useAssetStatistics(network, regularSymbol, address),
    jsonGet<
      { page: number; address: string; token: string },
      TransactionsLoaderData
    >(`${url.origin}/${network}/query/userTransactions`, {
      page: 1,
      address,
      token: regularToken,
    }).then((res) =>
      res.transactions?.map((tx) => {
        const desc = tx.sender === address ? "Sent" : "Received";
        const value = tx.value;
        const reward = tx.reward;
        const transaction = tx.hash;
        const time = tx.timestamp;

        return { desc, value, reward, transaction, time };
      })
    ),
  ]);

  if (!assetStatistics.data) throw new Error("Couldn't fetch asset data.");
  if (!activity) throw new Error("Couldn't fetch activity data.");

  const topPrize = assetStatistics.data.user.aggregate.max;
  const avgPrize = assetStatistics.data.user.aggregate.avg.winning_amount;
  const topAssetPrize = assetStatistics.data.global.aggregate.max;

  return {
    topPrize,
    avgPrize,
    topAssetPrize,
    activity,
  };
};
