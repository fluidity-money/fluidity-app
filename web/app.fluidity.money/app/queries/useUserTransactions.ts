import { gql, Queryable, jsonPost } from "~/util";

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

  return jsonPost<UserTransactionsByAddressBody, UserTransactionsRes>(
    "https://graphql.bitquery.io",
    body,
    {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
    }
  );
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

  return jsonPost<UserTransactionsByTxHashBody, UserTransactionsRes>(
    "https://graphql.bitquery.io",
    body,
    {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
    }
  );
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

  return jsonPost<UserTransactionsAllBody, UserTransactionsRes>(
    "https://graphql.bitquery.io",
    body,
    {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
    }
  );
};

export {
  useUserTransactionsAll,
  useUserTransactionsByAddress,
  useUserTransactionsByTxHash,
};
