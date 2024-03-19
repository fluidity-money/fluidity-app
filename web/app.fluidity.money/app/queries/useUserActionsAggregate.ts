import Transaction from "~/types/Transaction";
import { fetchGqlEndpoint, gql, jsonPost, Queryable } from "~/util";
import { Rarity } from "@fluidity-money/surfing";

export type AggregatedTransaction = Omit<
  Transaction,
  "utilityTokens" | "swapType" | "logo" | "provider" | "timestamp"
> & {
  utility_amount: number;
  utility_name: string | null;
  swap_in: boolean;
  type: "send" | "swap";
  timestamp: string;
  rewardTier: Rarity;
  lootboxCount: number;
};

const queryByAddress: Queryable = {
  arbitrum: gql`
    query AggregatedUserTransactionsByAddress(
      $offset: Int = 0
      $limit: Int = 12
      $address: String!
      $token: String
    ) {
      arbitrum: aggregated_user_transactions(
        order_by: { time: desc }
        limit: $limit
        offset: $offset
        where: {
          network: { _eq: "arbitrum" }
          token_short_name: { _eq: $token }
          type: { _is_null: false }
          _or: [
            { sender_address: { _eq: $address } }
            { recipient_address: { _eq: $address } }
          ]
        }
      ) {
        value: amount
        application
        network
        receiver: recipient_address
        rewardHash: reward_hash
        sender: sender_address
        swap_in
        timestamp: time
        currency: token_short_name
        hash: transaction_hash
        type
        utility_amount
        utility_name
        winner: winning_address
        reward: winning_amount
        rewardTier: reward_tier
        lootboxCount: lootbox_count
      }
    }
  `,
  solana: gql`
    query AggregatedUserTransactionsByAddress(
      $offset: Int = 0
      $limit: Int = 12
      $address: String!
    ) {
      solana: aggregated_user_transactions(
        order_by: { time: desc }
        limit: $limit
        offset: $offset
        where: {
          network: { _eq: "solana" }
          type: { _is_null: false }
          _or: [
            { sender_address: { _eq: $address } }
            { recipient_address: { _eq: $address } }
          ]
        }
      ) {
        value: amount
        application
        network
        receiver: recipient_address
        rewardHash: reward_hash
        sender: sender_address
        swap_in
        timestamp: time
        currency: token_short_name
        hash: transaction_hash
        type
        utility_amount
        utility_name
        winner: winning_address
        reward: winning_amount
        rewardTier: reward_tier
        lootboxCount: lootbox_count
      }
    }
  `,
  sui: gql`
    query AggregatedUserTransactionsByAddress(
      $offset: Int = 0
      $limit: Int = 12
      $address: String!
      $token: String
    ) {
      sui: aggregated_user_transactions(
        order_by: { time: desc }
        limit: $limit
        offset: $offset
        where: {
          network: { _eq: "sui" }
          token_short_name: { _eq: $token }
          type: { _is_null: false }
          _or: [
            { sender_address: { _eq: $address } }
            { recipient_address: { _eq: $address } }
          ]
        }
      ) {
        value: amount
        application
        network
        receiver: recipient_address
        rewardHash: reward_hash
        sender: sender_address
        swap_in
        timestamp: time
        currency: token_short_name
        hash: transaction_hash
        type
        utility_amount
        utility_name
        winner: winning_address
        reward: winning_amount
        rewardTier: reward_tier
        lootboxCount: lootbox_count
      }
    }
  `,
};

const queryAll: Queryable = {
  arbitrum: gql`
    query aggregatedUserTransactionsAll($offset: Int = 0, $limit: Int = 12) {
      arbitrum: aggregated_user_transactions(
        order_by: { time: desc }
        limit: $limit
        offset: $offset
        where: { network: { _eq: "arbitrum" }, type: { _is_null: false } }
      ) {
        value: amount
        application
        network
        receiver: recipient_address
        rewardHash: reward_hash
        sender: sender_address
        swap_in
        timestamp: time
        currency: token_short_name
        hash: transaction_hash
        type
        utility_amount
        utility_name
        winner: winning_address
        reward: winning_amount
        rewardTier: reward_tier
        lootboxCount: lootbox_count
      }
    }
  `,
  solana: gql`
    query aggregatedUserTransactionsAll($offset: Int = 0, $limit: Int = 12) {
      solana: aggregated_user_transactions(
        order_by: { time: desc }
        limit: $limit
        offset: $offset
        where: { network: { _eq: "solana" }, type: { _is_null: false } }
      ) {
        value: amount
        application
        network
        receiver: recipient_address
        rewardHash: reward_hash
        sender: sender_address
        swap_in
        timestamp: time
        currency: token_short_name
        hash: transaction_hash
        type
        utility_amount
        utility_name
        winner: winning_address
        reward: winning_amount
        rewardTier: reward_tier
        lootboxCount: lootbox_count
      }
    }
  `,
  sui: gql`
    query aggregatedUserTransactionsAll($offset: Int = 0, $limit: Int = 12) {
      sui: aggregated_user_transactions(
        order_by: { time: desc }
        limit: $limit
        offset: $offset
        where: { network: { _eq: "sui" }, type: { _is_null: false } }
      ) {
        value: amount
        application
        network
        receiver: recipient_address
        rewardHash: reward_hash
        sender: sender_address
        swap_in
        timestamp: time
        currency: token_short_name
        hash: transaction_hash
        type
        utility_amount
        utility_name
        winner: winning_address
        reward: winning_amount
        rewardTier: reward_tier
        lootboxCount: lootbox_count
      }
    }
  `,
};

type UserTransactionsAggregateBody = {
  query: string;
  variables: {
    token?: string;
    limit: number;
    offset: number;
  };
};

export type UserTransactionsAggregateRes = {
  data?: { [network: string]: AggregatedTransaction[] };
  errors?: unknown;
};

const useUserActionsAll = async (
  network: string,
  page: number,
  token?: string,
  limit = 12
) => {
  const variables = {
    token,
    offset: (page - 1) * 12,
    limit,
  };

  const body = {
    query: queryAll[network],
    variables,
  };

  const { url, headers } = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {
      errors: `Failed to fetch GraphQL URL and headers for network ${network}`,
    };

  const result = await jsonPost<
    UserTransactionsAggregateBody,
    UserTransactionsAggregateRes
  >(url, body, headers);

  return result;
};

const useUserActionsByAddress = async (
  network: string,
  address: string,
  page: number,
  token?: string,
  limit = 12
) => {
  const variables = {
    offset: (page - 1) * 12,
    limit,
    address,
    token,
  };

  const body = {
    query: queryByAddress[network],
    variables,
  };

  const { url, headers } = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {
      errors: `Failed to fetch GraphQL URL and headers for network ${network}`,
    };

  const result = await jsonPost<
    UserTransactionsAggregateBody,
    UserTransactionsAggregateRes
  >(url, body, headers);

  return result;
};

export { useUserActionsAll, useUserActionsByAddress };
