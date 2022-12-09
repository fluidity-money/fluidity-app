import { getTokenForNetwork, gql, Queryable, jsonPost } from "~/util";

const queryByAddress: Queryable = {
  ethereum: gql`
    query getTransactionsByAddress(
      $fluidCurrencies: [String!]
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
    ) {
      ethereum {
        transfers(
          currency: { in: $fluidCurrencies }
          any: [{ sender: { is: $address } }, { receiver: { is: $address } }]
          options: {
            desc: "block.timestamp.unixtime"
            limit: 12
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
      $fluidCurrencies: [String!]
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
    ) {
      solana {
        transfers(
          currency: { in: $fluidCurrencies }
          any: [
            { senderAddress: { is: $address } }
            { receiverAddress: { is: $address } }
          ]
          options: {
            desc: "block.timestamp.unixtime"
            limit: 12
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
    ) {
      ethereum {
        transfers(
          options: {
            desc: "block.timestamp.unixtime"
            limit: 12
          }
          txHash: { in: $transactions }
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
    ) {
      solana {
        transfers(
          options: {
            desc: "block.timestamp.unixtime"
            limit: 12
          }
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
      $fluidCurrencies: [String!]
      $offset: Int = 0
      $filterHashes: [String!] = []
    ) {
      ethereum {
        transfers(
          currency: { in: $fluidCurrencies }
          options: {
            desc: "block.timestamp.unixtime"
            limit: 12
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
      $fluidCurrencies: [String!]
      $offset: Int = 0
      $filterHashes: [String!] = []
    ) {
      solana {
        transfers(
          currency: { in: $fluidCurrencies }
          options: {
            desc: "block.timestamp.unixtime"
            limit: 12
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
    fluidCurrencies: string[];
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
    fluidCurrencies: string[];
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
  page: number,
  address: string,
  filterHashes: string[]
) => {
  const variables = {
    address: address,
    offset: (page - 1) * 12,
    fluidCurrencies: getTokenForNetwork(network),
    filterHashes,
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
  filterHashes: string[]
) => {
  const variables = {
    transactions,
    filterHashes,
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
  page: number,
  filterHashes: string[]
) => {
  const variables = {
    fluidCurrencies: getTokenForNetwork(network),
    offset: (page - 1) * 12,
    filterHashes,
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
