import Transaction from "~/types/Transaction";
import { fetchGqlEndpoint, gql, jsonPost, Queryable } from "~/util";

export type AggregatedTransaction = Omit<
  Transaction,
  "utilityTokens" | "swapType" | "logo" | "provider"
> & {
  utility_amount: number;
  utility_name: string | null;
  swap_in: boolean;
  type: "send" | "swap";
};

const queryByAddress: Queryable = {
  arbitrum: gql`
    query userActionsAggregateByAddress(
      $offset: Int = 0
      $limit: Int = 12
      $address: String!
      $token: String
    ) {
      arbitrum: user_transactions_aggregate(
        args: {
          network_: "arbitrum"
          filter_address: $address
          limit_: $limit
          offset_: $offset
          token: $token
        }
      ) {
        value: amount
        receiver: recipient_address
        rewardHash: reward_hash
        sender: sender_address
        hash: transaction_hash
        utility_amount
        utility_name
        winner: winning_address
        reward: winning_amount
        application
        currency
        timestamp: time
        swap_in
        type
      }
    }
  `,
  solana: gql`
    query userActionsAggregateByAddress(
      $offset: Int = 0
      $limit: Int = 12
      $address: String!
    ) {
      solana: user_transactions_aggregate(
        args: {
          network_: "solana"
          filter_address: $address
          limit_: $limit
          offset_: $offset
        }
      ) {
        value: amount
        receiver: recipient_address
        rewardHash: reward_hash
        sender: sender_address
        hash: transaction_hash
        utility_amount
        utility_name
        winner: winning_address
        reward: winning_amount
        application
        currency
        timestamp: time
        swap_in
        type
      }
    }
  `,
};

const queryAll: Queryable = {
  arbitrum: gql`
    query userActionsAggregateAll(
      $offset: Int = 0
      $limit: Int = 12
      $token: String
    ) {
      arbitrum: user_transactions_aggregate(
        args: {
          network_: "arbitrum"
          limit_: $limit
          offset_: $offset
          token: $token
        }
      ) {
        value: amount
        receiver: recipient_address
        rewardHash: reward_hash
        sender: sender_address
        hash: transaction_hash
        utility_amount
        utility_name
        winner: winning_address
        reward: winning_amount
        application
        currency
        timestamp: time
        swap_in
        type
      }
    }
  `,
  solana: gql`
  query userActionsAggregateAll(
      $offset: Int = 0,
      $limit: Int = 12,
  ) {
    solana: user_transactions_aggregate(args: {network_: "solana",limit_: $limit, offset_: $offset}) {
      value: amount
      receiver: recipient_address
      rewardHash: reward_hash
      sender: sender_address
      hash: transaction_hash
      utility_amount
      utility_name
      winner: winning_address
      reward: winning_amount
      application
      currency
      timestamp: time
      swap_in
      type
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
