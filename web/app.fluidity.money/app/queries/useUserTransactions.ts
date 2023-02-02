import { gql, Queryable, jsonPost } from "~/util";
import {fetchGqlEndpoint} from "~/util/api/graphql";

const queryByAddress: Queryable = {
  ethereum: gql`
    query getTransactionsByAddress(
      $tokens: [String!]
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      ethereum {
        transfers(
          currency: { in: $tokens }
          any: [{ sender: { is: $address } }, { receiver: { is: $address } }]
          options: {
            desc: "block.timestamp.unixtime"
            limit: $limit
            offset: $offset
          }
        ) {
          sender {
            address
          }
          receiver {
            address
          }
          amount
          currency {
            symbol
          }
          transaction(txHash: { notIn: $filterHashes }) {
            hash
          }
          block {
            timestamp {
              unixtime
            }
          }
        }
      }
    }
  `,

  solana: gql`
    query getTransactionsByAddress(
      $tokens: [String!]
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      solana {
        transfers(
          currency: { in: $tokens }
          any: [
            { senderAddress: { is: $address } }
            { receiverAddress: { is: $address } }
          ]
          options: {
            desc: "block.timestamp.unixtime"
            limit: $limit
            offset: $offset
          }
        ) {
          sender {
            address
          }
          receiver {
            address
          }
          amount
          currency {
            symbol
          }
          block {
            timestamp {
              unixtime
            }
          }
          transaction(txHash: { notIn: $filterHashes }) {
            hash: signature
          }
        }
      }
    }
  `,

  arbitrum: gql`
    query getTransactionsByAddress(
      $network: network_blockchain!, 
      $tokens: [String!], 
      $address: String!, 
      $offset: Int = 0, 
      $filterHashes: [String!] = [], 
      $limit: Int = 12
    ) {
    arbitrum: user_actions(
      where: {
        network: { _eq: "arbitrum" },
       _not: { transaction_hash: { _in: $filterHashes } }, 
       token_short_name: { _in: $tokens }, 
       sender_address: { _eq: $address }, _or: { recipient_address: { _eq: $address } }
      }, 
      order_by: {time: desc},
      limit: $limit, 
      offset: $offset
    ) {
      sender_address
      recipient_address
      token_short_name
      time
      transaction_hash
      amount
    }
  }`
};

const queryByTxHash: Queryable = {
  ethereum: gql`
    query getTransactionsByTxHash(
      $transactions: [String!]
      $filterHashes: [String!] = []
      $tokens: [String!] = []
      $limit: Int = 12
    ) {
      ethereum {
        transfers(
          options: { desc: "block.timestamp.unixtime", limit: $limit }
          txHash: { in: $transactions }
          currency: { in: $tokens }
        ) {
          sender {
            address
          }
          receiver {
            address
          }
          amount
          currency {
            symbol
          }
          transaction(txHash: { notIn: $filterHashes }) {
            hash
          }
          block {
            timestamp {
              unixtime
            }
          }
        }
      }
    }
  `,

  solana: gql`
    query getTransactionsByTxHash(
      $transactions: [String!]
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      solana {
        transfers(
          options: { desc: "block.timestamp.unixtime", limit: $limit }
          signature: { in: $transactions }
        ) {
          sender {
            address
          }
          receiver {
            address
          }
          amount
          currency {
            symbol
          }
          block {
            timestamp {
              unixtime
            }
          }
          transaction(txHash: { notIn: $filterHashes }) {
            hash: signature
          }
        }
      }
    }
  `,

  arbitrum: gql`
    query getTransactionsByTxHash(
      $network: network_blockchain!, 
      $transactions: [String!],
      $filterHashes: [String!] = [], 
      $limit: Int = 12
    ) {
    arbitrum: user_actions(
      where: {
        network: { _eq: "arbitrum" },
       _not: { transaction_hash: {_in: $filterHashes } },
       transaction_hash: { in: $transactions }
      }, 
      order_by: {time: desc},
      limit: $limit, 
      offset: $offset
    ) {
      sender_address
      recipient_address
      token_short_name
      time
      transaction_hash
      amount
    }
  }`
};

const queryAll: Queryable = {
  ethereum: gql`
    query getTransactions(
      $tokens: [String!]
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      ethereum {
        transfers(
          currency: { in: $tokens }
          options: {
            desc: "block.timestamp.unixtime"
            limit: $limit
            offset: $offset
          }
        ) {
          sender {
            address
          }
          receiver {
            address
          }
          amount
          currency {
            symbol
          }
          transaction(txHash: { notIn: $filterHashes }) {
            hash
          }
          block {
            timestamp {
              unixtime
            }
          }
        }
      }
    }
  `,

  solana: gql`
    query getTransactions(
      $tokens: [String!]
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      solana {
        transfers(
          currency: { in: $tokens }
          options: {
            desc: "block.timestamp.unixtime"
            limit: $limit
            offset: $offset
          }
        ) {
          sender {
            address
          }
          receiver {
            address
          }
          amount
          currency {
            symbol
          }
          block {
            timestamp {
              unixtime
            }
          }
          transaction(txHash: { notIn: $filterHashes }) {
            hash: signature
          }
        }
      }
    }
  `,

  arbitrum: gql`
    query getTransactions(
      $network: network_blockchain!, 
      $tokens: [String!], 
      $offset: Int = 0, 
      $filterHashes: [String!] = [], 
      $limit: Int = 12
    ) {
    arbitrum: user_actions(
      where: {
        network: { _eq: "arbitrum" },
       _not: { transaction_hash: { _in: $filterHashes } }, 
       token_short_name: { _in: $tokens }
      }, 
      order_by: { time: desc },
      limit: $limit, 
      offset: $offset
    ) {
      sender_address
      recipient_address
      token_short_name
      time
      transaction_hash
      amount
    }
  }
`
};

type UserTransactionsByAddressBody = {
  query: string;
  variables: {
    address: string;
    offset: number;
    tokens: string[];
    filterHashes?: string[];
  };
};

type UserTransactionsByTxHashBody = {
  query: string;
  variables: {
    transactions: string[];
    filterHashes?: string[];
  };
};

type UserTransactionsAllBody = {
  query: string;
  variables: {
    offset: number;
    tokens: string[];
    filterHashes?: string[];
  };
};

export type UserTransactionsRes = {
  data?: {
    [network: string]: {
      transfers: UserTransaction[];
    };
  };
  errors?: unknown;
};

export type UserTransaction = {
  sender: {
    address: string;
  };
  receiver: { address: string };
  block: { timestamp: { unixtime: number } };
  transaction: { hash: string };
  amount: number;
  currency: { symbol: string };
};


const useUserTransactionsByAddress = async (
  network: string,
  tokens: string[],
  page: number,
  address: string,
  filterHashes: string[],
  limit = 12
) => {
  const variables = {
    address: address,
    offset: (page - 1) * 12,
    tokens,
    filterHashes,
    limit,
  };

  const body = {
    query: queryByAddress[network],
    variables,
  };

  const {url, headers} = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {errors: `Failed to fetch GraphQL URL and headers for network ${network}`}

  const result = await jsonPost<UserTransactionsByAddressBody, UserTransactionsRes>(
    url,
    body,
    headers, 
  );

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    result.data[network].transfers = (result as any).data.transfers;
  }

  return result; 
};

const useUserTransactionsByTxHash = async (
  network: string,
  transactions: string[],
  filterHashes: string[],
  tokens: string[],
  limit = 12
) => {
  const variables = {
    transactions,
    filterHashes,
    tokens,
    limit,
  };

  const body = {
    query: queryByTxHash[network],
    variables,
  };

  const {url, headers} = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {errors: `Failed to fetch GraphQL URL and headers for network ${network}`}

  const result = await jsonPost<UserTransactionsByTxHashBody, UserTransactionsRes>(
    url,
    body,
    headers,
  );

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    result.data[network].transfers = (result as any).data.transfers;
  }

  return result; 
};

const useUserTransactionsAll = async (
  network: string,
  tokens: string[],
  page: number,
  filterHashes: string[],
  limit = 12
) => {
  const variables = {
    tokens,
    offset: (page - 1) * 12,
    filterHashes,
    limit,
  };

  const body = {
    query: queryAll[network],
    variables,
  };

  const {url, headers} = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {errors: `Failed to fetch GraphQL URL and headers for network ${network}`}

  const result = await jsonPost<UserTransactionsAllBody, UserTransactionsRes>(
    url,
    body,
    headers,
  );

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    result.data[network].transfers = (result as any).data.transfers;
  }

  return result; 
};

export {
  useUserTransactionsAll,
  useUserTransactionsByAddress,
  useUserTransactionsByTxHash,
};
