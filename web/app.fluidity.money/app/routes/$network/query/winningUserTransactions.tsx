import type Transaction from "~/types/Transaction";

import { LoaderFunction, json } from "@remix-run/node";
import config from "~/webapp.config.server";
import {
  useUserPendingRewardsAll,
  useUserPendingRewardsByAddress,
  useUserRewardsAll,
  useUserRewardsByAddress,
  useUserTransactionsByTxHash,
} from "~/queries";
import { captureException } from "@sentry/react";
import { MintAddress } from "~/types/MintAddress";
import { Winner } from "~/queries/useUserRewards";
import {
  translateRewardTierToRarity,
  useLootboxesByTxHash,
} from "~/queries/useLootBottles";
import { Rarity } from "@fluidity-money/surfing";
import { BottleTiers } from "./dashboard/airdrop";

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
  loaded: boolean;
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
    const [
      { data: winnersData, errors: winnersErr },
      { data: pendingWinnersData, errors: pendingWinnersErr },
    ] = await Promise.all(
      address
        ? [
            useUserRewardsByAddress(network ?? "", address),
            useUserPendingRewardsByAddress(network ?? "", address),
          ]
        : [
            useUserRewardsAll(network ?? ""),
            useUserPendingRewardsAll(network ?? ""),
          ]
    );

    if (
      winnersErr ||
      !winnersData ||
      !pendingWinnersData ||
      pendingWinnersErr
    ) {
      throw winnersErr;
    }

    const castPending: Winner[] =
      pendingWinnersData.ethereum_pending_winners.map((pending_winner) => {
        return {
          network: pending_winner.network,
          solana_winning_owner_address: null,
          winning_address: pending_winner.address,
          created: "",
          transaction_hash: "",
          send_transaction_hash: pending_winner.transaction_hash,
          winning_amount: pending_winner.win_amount,
          token_decimals: pending_winner.token_decimals,
          ethereum_application: undefined,
          solana_application: undefined,
          reward_type: pending_winner.reward_type,
          awarded_time: pending_winner.inserted_date,
          utility_name: pending_winner.utility_name,
        };
      });

    winnersData.winners = castPending
      .concat(winnersData.winners)
      .sort(
        (first, second) =>
          Date.parse(second.awarded_time) - Date.parse(first.awarded_time)
      );

    // If no wins found, return early
    if (!winnersData.winners.length) {
      return json({
        page,
        transactions: [],
        count: winnersData.winners.length,
        loaded: true,
      } satisfies TransactionsLoaderData);
    }

    // winnersMap looks up if a transaction was the send that caused a win
    const winners = winnersData.winners.slice((page - 1) * 12, page * 12);

    const winnerAddrs = winners.map(
      ({ send_transaction_hash }) => send_transaction_hash
    );

    const ethereumTokens = config.config["ethereum"].tokens
      .filter((entry) => entry.isFluidOf !== undefined)
      .map((entry) => entry.symbol);

    const [
      { data: userTransactionsData, errors: userTransactionsErr },
      { data: lootbottlesData, errors: lootbottlesErr },
    ] = await Promise.all([
      useUserTransactionsByTxHash(network, winnerAddrs, [], ethereumTokens),
      useLootboxesByTxHash(winnerAddrs),
    ]);

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
      return Error("Server could not fulfill request");
    }

    if (!lootbottlesData || lootbottlesErr) {
      captureException(new Error(`Could not fetch Lootbottles`), {
        tags: {
          section: "dashboard",
        },
      });
      return Error("Server could not fulfill request");
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
            network !== "arbitrum" &&
            (currency === "DAI" || currency === "fDAI")
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

    const transactionMap = userTransactions.reduce(
      (map, tx) => ({
        ...map,
        [tx.hash]: tx,
      }),
      {} as Record<string, UserTransaction>
    );

    const lootbottlesMap = lootbottlesData.lootbox.reduce(
      (map, { txHash, rewardTier, lootboxCount }) => {
        if (!txHash) return map;

        if (!map[txHash]) {
          return {
            ...map,
            [txHash]: {
              [Rarity.Common]: 0,
              [Rarity.Uncommon]: 0,
              [Rarity.Rare]: 0,
              [Rarity.UltraRare]: 0,
              [Rarity.Legendary]: 0,
              [translateRewardTierToRarity(rewardTier)]: lootboxCount,
            },
          };
        }

        return {
          ...map,
          [txHash]: {
            ...map[txHash],
            [translateRewardTierToRarity(rewardTier)]:
              map[txHash][translateRewardTierToRarity(rewardTier)] +
              lootboxCount,
          },
        };
      },
      {} as {
        [txHash: string]: BottleTiers;
      }
    );

    Object.entries(lootbottlesMap).forEach(([txHash, bottles]) => {
      if (Object.values(bottles).every((amt: number) => amt <= 0.005)) {
        delete lootbottlesMap[txHash];
      }
    });

    const mergedTransactions: Transaction[] = winners
      .filter(({ send_transaction_hash: hash }) => !!transactionMap[hash])
      .map((winner) => {
        const tx = transactionMap[winner.send_transaction_hash];

        const swapType =
          tx.sender === MintAddress
            ? "in"
            : tx.receiver === MintAddress
            ? "out"
            : undefined;

        const isSend = tx.sender === winner.winning_address;

        const reward = winner.winning_amount / 10 ** winner.token_decimals;

        return {
          sender: tx.sender,
          receiver: tx.receiver,
          winner: winner.winning_address ?? "",
          reward,
          hash: tx.hash,
          rewardHash:
            winner.ethereum_application === undefined
              ? ""
              : winner?.transaction_hash ?? "",
          currency: tx.currency,
          value: tx.value,
          timestamp: new Date(winner.awarded_time).getTime(),
          logo: tokenLogoMap[tx.currency] || defaultLogo,
          provider:
            (network === "ethereum" || network === "arbitrum"
              ? winner?.ethereum_application
              : winner?.solana_application) ?? "Fluidity",
          swapType,
          lootBottles: isSend ? lootbottlesMap[tx.hash] : undefined,
          wombatTokens:
            winner.utility_name === "wombat initial boost" ? reward : undefined,
        };
      });

    return json({
      page,
      transactions: mergedTransactions,
      count: winnersData.winners.length,
      loaded: true,
    } satisfies TransactionsLoaderData);
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
