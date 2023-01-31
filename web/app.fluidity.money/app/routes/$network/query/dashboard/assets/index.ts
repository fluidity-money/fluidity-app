import { Tokens } from "@fluidity-money/surfing/dist/types/components/Images/Token/Token";
import { LoaderFunction } from "react-router-dom";
import { useUserTransactionsByAddress } from "~/queries";
import useAssetStatistics from "~/queries/useAssetStatistics";

export type ITokenHeader = {
  token: Tokens,
  fluidAmt: number,
  regAmt: number,
  // From Hasura
  value: number,
  topPrize: { 
    winning_amount: number,
    transaction_hash: string
  },
  avgPrize: number,
  topAssetPrize: { 
    winning_amount: number;
    transaction_hash: string;
  },
  activity: Array<{
    desc: string;
    value: number;
    reward: number;
    transaction: string;
  }>
}

type ITokenStatistics = Omit<ITokenHeader, "token" | "fluidAmt" | "regAmt" | "value">

export const loader: LoaderFunction = async ({ request, params }): Promise<ITokenStatistics> => {

  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const token = url.searchParams.get("token")

  const network = params.network as string

  if (!address) throw new Error("address is required");
  if (!token) throw new Error("token is required");

  const [
    assetStatistics,
    activity
  ] = await Promise.all(
    [
      useAssetStatistics(network, token, address),
      useUserTransactionsByAddress(network, [token], 1, address, [], 3).then(
        (res) => res.data?.[network].transfers.map((tx) => {
          const desc = tx.sender.address === address ? "Sent" : "Received"
          const value = tx.amount
          const reward = 1000
          const transaction = tx.transaction.hash
          return { desc, value, reward, transaction }
        })
      )
    ]
  )

  if (!assetStatistics.data) throw new Error("Couldn't fetch asset data.")
  if (!activity) throw new Error("Couldn't fetch activity data.")

  const topPrize = assetStatistics.data.global.aggregate.max
  const avgPrize = assetStatistics.data.user.aggregate.avg.winning_amount
  const topAssetPrize = assetStatistics.data.user.aggregate.max

  return {
    topPrize,
    avgPrize,
    topAssetPrize,
    activity
  } 
}