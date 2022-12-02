import type { UserTransaction } from "~/routes/$network/query/userTransactions";
import type { Winner } from "~/queries/useUserRewards";
import type Transaction from "~/types/Transaction";

import { LoaderFunction, json } from "@remix-run/node";
import config from "~/webapp.config.server";
import { useUserRewardsAll } from "~/queries";
import { MintAddress } from "~/types/MintAddress";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  try {
    const {
      transactions,
      count,
    }: { transactions: UserTransaction[]; count: number } = await (
      await fetch(
        `${url.origin}/${network}/query/userTransactions?network=${network}&page=${page}`
      )
    ).json();

    const { data, errors } = await useUserRewardsAll(network ?? "");

    if (errors || !data) {
      throw errors;
    }

    // winners to look up if a transaction was the send that caused a win
    // payouts to look up if a transaction was a payout transaction
    type winnerMap = { [key: string]: Winner };
    const { winners: winnersMap, payouts: payoutsMap } = data.winners.reduce(
      (map, winner) => ({
        ...map,
        winners: {
          ...map.winners,
          [winner.send_transaction_hash]: {
            ...winner,
          },
        },
        payouts: {
          ...map.payouts,
          [winner.transaction_hash]: {
            ...winner,
          },
        },
      }),
      {} as { winners: winnerMap; payouts: winnerMap }
    );

    const {
      config: {
        [network as string]: { tokens },
      },
    } = config;

    const tokenLogoMap = tokens.reduce(
      (map, token) => ({
        ...map,
        [token.symbol]: token.logo,
      }),
      {} as Record<string, string>
    );

    const defaultLogo = "/assets/tokens/fUSDT.png";

    const mergedTransactions: Transaction[] =
      transactions?.flatMap((tx) => {
        const payout = payoutsMap[tx.hash];

        // transaction is a payout already included as a reward value, so skip it
        if (payout) {
          return [];
        }

        const swapType =
          tx.sender === MintAddress
            ? "in"
            : tx.receiver === MintAddress
            ? "out"
            : undefined;

        const winner = winnersMap[tx.hash];

        return {
          // if a swap in, we want to display the swapper
          sender: swapType === "in" ? tx.receiver : tx.sender,
          receiver: tx.receiver,
          winner: winner?.winning_address ?? "",
          reward: winner
            ? winner.winning_amount / 10 ** winner.token_decimals
            : 0,
          hash: tx.hash,
          rewardHash: winner?.transaction_hash ?? "",
          currency: tx.currency,
          value: tx.value,
          timestamp: tx.timestamp,
          logo: tokenLogoMap[tx.currency] || defaultLogo,
          provider:
            (network === "ethereum"
              ? winner?.ethereum_application
              : winner?.solana_application) ?? "",
          swapType,
        };
      }) ?? [];

    const totalRewards = mergedTransactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    const totalVolume = mergedTransactions.reduce(
      (sum, { value }) => sum + value,
      0
    );

    return json({
      totalTransactions: mergedTransactions,
      totalCount: count,
      totalRewards,
      totalVolume,
      fluidPairs,
      page,
      network,
      timestamp: new Date().getTime(),
    });
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Transactions on ${network}: ${err}`);
  } // Fail silently - for now.
};
