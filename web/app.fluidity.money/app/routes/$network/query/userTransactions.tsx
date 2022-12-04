import type Transaction from "~/types/Transaction";
import type { Winner } from "~/queries/useUserRewards";

import { LoaderFunction, json } from "@remix-run/node";
import config from "~/webapp.config.server";
import {
  useUserRewardsAll,
  useUserRewardsByAddress,
  useUserTransactionsByTxHash,
  useUserTransactionsAll,
  useUserTransactionsByAddress,
} from "~/queries";
import { captureException } from "@sentry/react";
import { MintAddress } from "~/types/MintAddress";

type UserTransaction = {
  sender: string;
  receiver: string;
  hash: string;
  timestamp: number;
  value: number;
  currency: string;
};

export type TransactionsLoader = {
  transactions: Transaction[]
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const winnersOnly = url.searchParams.get("winsOnly");
  const address = url.searchParams.get("address");
  const page_ = url.searchParams.get("page");

  if (!network || !page_) return new Error("Invalid Request");

  const page = parseInt(page_);

  if (!page || page < 1 || page > 20) return new Error("Invalid Request");

  try {
    const { data: winnersData, errors: winnersErr } = address ? await useUserRewardsByAddress(network ?? "", address) : await useUserRewardsAll(network ?? "") ;

    if (winnersErr || !winnersData) {
      throw winnersErr;
    }

    // winnersMap looks up if a transaction was the send that caused a win
    const winnersMap = winnersData.winners.reduce(
      (map, winner) => ({
        ...map,
        [winner.send_transaction_hash]: {
          ...winner,
        },
      }),
      {} as { [key: string]: Winner }
    );
    
    // payoutsMap looks up if a transaction was a payout transaction
    const payoutsMap = winnersData.winners.reduce(
      (map, winner) => ({
          ...map,
          [winner.transaction_hash]: {
            ...winner,
          },
      }),
      {} as { [key: string]: Winner }
    )
    
    const { data: userTransactionsData, errors: userTransactionsErr } = await (
      (async () => {
        switch (true) {
          case (!!winnersOnly): 
              return useUserTransactionsByTxHash(network, Object.keys(winnersMap))
          case (!!address): 
            return useUserTransactionsByAddress(network, address as string)
          default:
            return useUserTransactionsAll(network)
      }})()
    );
    
    if (!userTransactionsData || userTransactionsErr) {
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
    
    // skip payout transactions
    const sanitisedTransactions: UserTransaction[] = userTransactions.filter(({hash}) => !payoutsMap[hash])

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
    
    const mergedTransactions: Transaction[] = sanitisedTransactions.map(tx => {
      const swapType =
        tx.sender === MintAddress
          ? "in"
          : tx.receiver === MintAddress
          ? "out"
          : undefined;

      const winner = winnersMap[tx.hash];
      
      return {
        sender: tx.sender,
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
            : winner?.solana_application) ?? "Fluidity",
        swapType,
      };
    })
    
    return json({
      transactions: mergedTransactions,
    } as TransactionsLoader);
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
