import type Transaction from "~/types/Transaction";
import {
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
  translateRewardTierToRarity,
} from "~/queries";
import { captureException } from "@sentry/react";
import { MintAddress } from "~/types/MintAddress";
import {
  getTokenForNetwork,
  getTokenFromAddress,
  networkGqlBackend,
} from "~/util";
import {
  useUserActionsAll,
  useUserActionsByAddress,
} from "~/queries/useUserActionsAggregate";
import { Rarity } from "@fluidity-money/surfing";
import { chainType } from "~/util/chainUtils/chains";

const FLUID_UTILITY = "FLUID";

const ALPHA_NUMERIC = /[a-z0-9]*/i;

type UserTransaction = {
  sender: string;
  receiver: string;
  hash: string;
  timestamp: number;
  value: number;
  currency: string;
  application: string;
  rewardTier: Rarity;
  lootboxCount: number;
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
  const token = url.searchParams.get("token");
  const page_ = url.searchParams.get("page");

  if (!network || !page_) return new Error("Invalid Request");

  const page = parseInt(page_);

  if (!page || page < 1 || page > 20) return new Error("Invalid Request");

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

  const defaultLogo = "https://app-cdn.fluidity.money/assets/tokens/fUSDC.svg";

  // use updated SQL aggregation
  if (networkGqlBackend(network) === "hasura") {
    const { data: userActionsData, errors: userActionsErr } = address
      ? await useUserActionsByAddress(
          network,
          address,
          page,

          token
            ? getTokenFromAddress("arbitrum", token)?.symbol?.slice(1)
            : undefined
        )
      : await useUserActionsAll(
          network,
          page,
          token
            ? getTokenFromAddress("arbitrum", token)?.symbol?.slice(1)
            : undefined
        );

    if (userActionsErr || !userActionsData) {
      throw userActionsErr;
    }

    const transactions = userActionsData[network].map(
      ({
        sender,
        receiver,
        hash,
        winner,
        reward,
        rewardHash,
        timestamp,
        value,
        currency,
        application,
        utility_name,
        utility_amount,
        type,
        swap_in,
        rewardTier,
        lootboxCount,
      }) => {
        const utilityName = utility_name?.match(ALPHA_NUMERIC)?.[0];

        // if labelled as swap, use swap direction, otherwise manually check
        const swapType =
          type === "swap"
            ? swap_in
              ? "in"
              : "out"
            : sender === MintAddress
            ? ("in" as const)
            : receiver === MintAddress
            ? ("out" as const)
            : undefined;

        return {
          sender,
          receiver,
          hash,
          winner,
          reward,
          rewardHash,
          // convert to JS timestamp
          timestamp: new Date(timestamp + "Z").getTime(),
          value,
          currency: currency === "FLY" ? currency : "f" + currency,
          application,
          swapType,
          provider: application ?? "Fluidity",
          logo: tokenLogoMap[currency] || defaultLogo,
          utilityTokens:
            utilityName && utility_amount > 0
              ? { [utilityName]: utility_amount }
              : undefined,
          rewardTier,
          lootboxCount,
        };
      }
    );

    return json({
      page,
      transactions,
      count: transactions.length,
      loaded: true,
    } satisfies TransactionsLoaderData);
  }

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

    // set of transaction hashes corresponding to paid rewards
    const paidTransactionHashes = new Set(
      winnersData.winners.map(
        ({ send_transaction_hash }) => send_transaction_hash
      )
    );

    // castPending is the list of all pending rewards, casted to Winner
    const castPending = pendingWinnersData.ethereum_pending_winners
      // remove non-pending rewards
      .filter(
        ({ transaction_hash }) => !paidTransactionHashes.has(transaction_hash)
      )
      .map((pending_winner) => {
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
          token_short_name: pending_winner.token_short_name,
        };
      });

    const createWinnerMap = (winners: Winner[]) =>
      winners.reduce(
        (map, winner) => {
          const sameTxWinner = map[winner.send_transaction_hash] || winner;

          const currentFluidAmount: number = sameTxWinner.normalisedAmount || 0;

          const currentUtilityReward = sameTxWinner.utility || {};

          const normalisedAmount =
            winner.winning_amount / 10 ** winner.token_decimals;

          const utilityName =
            winner.utility_name.match(ALPHA_NUMERIC)?.[0] ?? FLUID_UTILITY;

          return winner.utility_name === FLUID_UTILITY
            ? {
                ...map,
                [winner.send_transaction_hash]: {
                  ...sameTxWinner,
                  normalisedAmount: normalisedAmount + currentFluidAmount,
                },
              }
            : {
                ...map,
                [winner.send_transaction_hash]: {
                  ...sameTxWinner,

                  utility: {
                    ...currentUtilityReward,
                    [utilityName]:
                      normalisedAmount +
                      (currentUtilityReward[utilityName] || 0),
                  },
                },
              };
        },
        {} as {
          [transaction_hash: string]: Winner & {
            normalisedAmount: number;
            utility: { [tokens: string]: number };
          };
        }
      );

    const jointWinners = winnersData.winners.concat(castPending);

    // jointWinnersMap looks up if a transaction was the send that caused a win
    const jointWinnersMap = createWinnerMap(jointWinners);

    // used to filter out reward transactions
    const jointPayoutTxHashes = [
      ...new Set(
        jointWinners
          .map(({ transaction_hash }) => transaction_hash)
          .filter((hash) => hash)
      ),
    ];

    const chunkArray = <T,>(arr: T[], size: number): T[][] =>
      arr.reduce(
        (chunkedArr, el, index) => {
          const chunkIndex = Math.floor(index / size);

          if (!chunkedArr[chunkIndex]) {
            chunkedArr[chunkIndex] = []; // start a new chunk
          }

          chunkedArr[chunkIndex].push(el);

          return chunkedArr;
        },
        [[]] as T[][]
      );

    // Chunk and filter out at most 99 txs at a time.
    // This is because bitquery cannot take in more than 100
    // jointPayoutAddrs at a time
    const rawUserTransfers = (
      await Promise.all(
        chunkArray(jointPayoutTxHashes, 100).map(async (filterHashes) => {
          const { data: transactionsData, errors: transactionsErr } =
            await (address
              ? useUserTransactionsByAddress(
                  network,
                  token ? [token] : getTokenForNetwork(network),
                  page,
                  address as string,
                  filterHashes,
                  12
                )
              : useUserTransactionsAll(
                  network,
                  token ? [token] : getTokenForNetwork(network),
                  page,
                  filterHashes,
                  12
                ));

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

            throw new Error("Server could not fulfill request");
          }

          return transactionsData.transfers;
        })
      )
    ).flat();

    // Destructure GraphQL data
    const userTransactions: UserTransaction[] = rawUserTransfers.map(
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
          application,
          lootboxCount,
          rewardTier: rewardTier_,
        } = transaction;

        const rewardTier =
          rewardTier_ ??
          translateRewardTierToRarity(
            Object.values(Rarity).indexOf(rewardTier_)
          );

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
          application,
          lootboxCount,
          rewardTier,
        };
      }
    );

    const mergedTransactions: Transaction[] = userTransactions.map((tx) => {
      const swapType =
        tx.sender === MintAddress
          ? "in"
          : tx.receiver === MintAddress
          ? "out"
          : undefined;

      const winner:
        | (Winner & {
            normalisedAmount: number;
            utility: { [utility: string]: number };
          })
        | undefined = jointWinnersMap[tx.hash];

      const winnerAddress = winner?.winning_address ?? "";

      const reward = winner?.normalisedAmount || 0;

      return {
        sender: tx.sender,
        receiver: tx.receiver,
        winner: winnerAddress,
        reward,
        hash: tx.hash,
        rewardHash: winner?.transaction_hash ?? "",
        currency: tx.currency,
        value: tx.value,
        timestamp: tx.timestamp,
        logo: tokenLogoMap[tx.currency] || defaultLogo,
        provider:
          (chainType(network) === "evm"
            ? winner?.ethereum_application
            : winner?.solana_application) ?? "Fluidity",
        swapType,
        utilityTokens: winner?.utility,
        application: tx.application,
        rewardTier: tx.rewardTier,
        lootboxCount: tx.lootboxCount,
      };
    });

    return json({
      page,
      transactions: mergedTransactions,
      count: Object.keys(jointWinnersMap).length,
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
