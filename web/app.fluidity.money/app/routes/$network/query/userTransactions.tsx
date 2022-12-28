import type Transaction from "~/types/Transaction";
import {
  PendingWinner,
  useUserPendingRewardsAll,
  useUserPendingRewardsByAddress,
  Winner,
} from "~/queries/useUserRewards";

import { LoaderFunction, json } from "@remix-run/node";
import config from "~/webapp.config.server";
import {
  useUserRewardsAll,
  useUserRewardsByAddress,
  useUserTransactionsAll,
  useUserTransactionsByAddress,
} from "~/queries";
import { captureException } from "@sentry/react";
import { MintAddress } from "~/types/MintAddress";
import { getTokenForNetwork } from "~/util";

type UserTransaction = {
  sender: string;
  receiver: string;
  hash: string;
  timestamp: number;
  value: number;
  currency: string;
};

export type TransactionsLoaderData = {
  transactions: Transaction[];
  page: number;
  count: number;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const page_ = url.searchParams.get("page");

  if (!network || !page_) return new Error("Invalid Request");

  const page = parseInt(page_);

  if (!page || page < 1 || page > 20) return new Error("Invalid Request");

  try {
    const { data: winnersData, errors: winnersErr } = address
      ? await useUserRewardsByAddress(network ?? "", address)
      : await useUserRewardsAll(network ?? "");

    const { data: pendingWinnersData, errors: pendingWinnersErr } = address
      ? await useUserPendingRewardsByAddress(network ?? "", address)
      : await useUserPendingRewardsAll(network ?? "");

    if (
      winnersErr ||
      !winnersData ||
      !pendingWinnersData ||
      pendingWinnersErr
    ) {
      throw winnersErr;
    }

    // winnersMap looks up if a transaction was the send that caused a win
    const winnersMap = winnersData.winners.reduce(
      (map, winner) => ({
        ...map,
        [winner.send_transaction_hash]: {
          ...winner,
          win_amount:
            winner.winning_amount +
            (map[winner.transaction_hash]?.winning_amount || 0),
        },
      }),
      {} as { [key: string]: Winner }
    );

    // winnersMap looks up if a transaction was the send that caused a win
    const pendingWinnersMap =
      pendingWinnersData.ethereum_pending_winners.reduce(
        (map, winner) => ({
          ...map,
          [winner.transaction_hash]: {
            ...winner,
            win_amount:
              winner.win_amount +
              (map[winner.transaction_hash]?.win_amount || 0),
          },
        }),
        {} as { [key: string]: PendingWinner }
      );

    const jointWinnersMap = {
      ...winnersMap,
      ...pendingWinnersMap,
    };

    // payoutsMap looks up if a transaction was a payout transaction
    const winnersPayoutAddrs = winnersData.winners.map(
      ({ transaction_hash }) => transaction_hash
    );

    const pendingWinnersPayoutAddrs = winnersData.winners.map(
      ({ transaction_hash }) => transaction_hash
    );

    const JointPayoutAddrs = winnersPayoutAddrs.concat(
      pendingWinnersPayoutAddrs
    );

    const userTransactionsData = {
      [network as string]: {
        transfers: [],
      },
    };

    for (let i = 0; i <= JointPayoutAddrs.length; i += 100) {
      const { data: transactionsData, errors: transactionsErr } =
        await (async () => {
          switch (true) {
            case !!address: {
              return useUserTransactionsByAddress(
                network,
                getTokenForNetwork(network),
                page,
                address as string,
                JointPayoutAddrs.slice(i, i + 99)
              );
            }
            default:
              return useUserTransactionsAll(
                network,
                getTokenForNetwork(network),
                page,
                JointPayoutAddrs.slice(i, i + 99)
              );
          }
        })();

      if (!transactionsData || transactionsErr) {
        captureException(
          new Error(
            `Could not fetch User Transactions for ${address}, on ${network}`
          ),
          {
            tags: {
              section: "dashboard",
            },
          }
        );

        return new Error("Server could not fulfill request");
      }
      Array.prototype.push.apply(
        userTransactionsData[network as string].transfers,
        transactionsData[network as string].transfers
      );
    }
    const {
      [network as string]: { transfers: transactions },
    } = userTransactionsData;

    // Destructure GraphQL data
    const userTransactions: UserTransaction[] = transactions.map(
      (transaction) => {
        const {
          sender: { address: sender },
          receiver: { address: receiver },
          block: {
            timestamp: { unixtime: timestamp },
          },
          transaction: { hash },
          amount: value,
          currency: { symbol: currency },
        } = transaction;

        return {
          sender,
          receiver,
          hash,
          // Normalise timestamp to ms
          timestamp: timestamp * 1000,
          // Bitquery stores DAI decimals (6) incorrectly (should be 18)
          value:
            currency === "DAI" || currency === "fDAI"
              ? value / 10 ** 12
              : value,
          currency,
        };
      }
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

    const defaultLogo = "/assets/tokens/usdt.svg";

    const mergedTransactions: Transaction[] = userTransactions.map((tx) => {
      const swapType =
        tx.sender === MintAddress
          ? "in"
          : tx.receiver === MintAddress
          ? "out"
          : undefined;

      const winner = jointWinnersMap[tx.hash];
      const isFromPendingWin = winner && tx.hash === winner.transaction_hash;

      return {
        sender: tx.sender,
        receiver: tx.receiver,
        winner: isFromPendingWin
          ? ((winner as PendingWinner)?.address as unknown as string)
          : ((winner as Winner)?.winning_address as unknown as string) ?? "",
        reward: winner
          ? (isFromPendingWin
              ? (winner as PendingWinner).win_amount
              : (winner as Winner).winning_amount) /
            10 ** winner.token_decimals
          : 0,
        hash: tx.hash,
        rewardHash: !isFromPendingWin ? winner?.transaction_hash : "" ?? "",
        currency: tx.currency,
        value: tx.value,
        timestamp: tx.timestamp,
        logo: tokenLogoMap[tx.currency] || defaultLogo,
        provider:
          (network === "ethereum"
            ? !isFromPendingWin
              ? (winner as Winner)?.ethereum_application
              : (winner as Winner)?.solana_application
            : "Fluidity") ?? "Fluidity",
        swapType,
      };
    });

    const splitMergedTransactions = mergedTransactions.slice(
      (page - 1) * 12,
      page * 12
    );

    return json({
      page,
      transactions: splitMergedTransactions,
      count: Object.keys(winnersMap).length,
    } as TransactionsLoaderData);
  } catch (err) {
    captureException(
      new Error(
        `BitQuery returned an invalid response for ${address}, on ${network}. Maybe your API key is invalid?`
      ),
      {
        tags: {
          section: "dashboard",
        },
      }
    );
    return new Error("Server could not fulfill request");
  }
};
