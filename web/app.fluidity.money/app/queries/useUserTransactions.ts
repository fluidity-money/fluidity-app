import { getTokenForNetwork, gql, Queryable, jsonPost } from "~/util";

const queryByAddress: Queryable = {
  ethereum: gql`
    query getTransactionsByAddress(
      $fluidCurrencies: [String!]
      $address: String!
      $offset: Int = 0
    ) {
      ethereum {
        transfers(
          currency: { in: $fluidCurrencies }
          any: [{ sender: { is: $address } }, { receiver: { is: $address } }]
          options: {
            desc: "block.timestamp.unixtime"
            limit: 240
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
          transaction {
            hash
          }
          block {
            timestamp {
              unixtime
            }
          }
          transaction {
            hash
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
            limit: 240
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
          transaction {
            hash: signature
          }
        }
      }
    }
  `,
};

const queryByTxHash: Queryable = {
  ethereum: gql`
    query getTransactionsByTxHash($transactions: [String!], $offset: Int = 0) {
      ethereum {
        transfers(
          options: {
            desc: "block.timestamp.unixtime"
            limit: 240
            offset: $offset
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
          transaction {
            hash
          }
          block {
            timestamp {
              unixtime
            }
          }
          transaction {
            hash
          }
        }
      }
    }
  `,

  solana: gql`
    query getTransactionsByTxHash($transactions: [String!], $offset: Int = 0) {
      solana {
        transfers(
          options: {
            desc: "block.timestamp.unixtime"
            limit: 240
            offset: $offset
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
          transaction {
            hash: signature
          }
        }
      }
    }
  `,
};

const queryAll: Queryable = {
  ethereum: gql`
    query getTransactions($fluidCurrencies: [String!], $offset: Int = 0) {
      ethereum {
        transfers(
          currency: { in: $fluidCurrencies }
          options: {
            desc: "block.timestamp.unixtime"
            limit: 240
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
          transaction {
            hash
          }
          block {
            timestamp {
              unixtime
            }
          }
          transaction {
            hash
          }
        }
      }
    }
  `,

  solana: gql`
    query getTransactions($fluidCurrencies: [String!], $offset: Int = 0) {
      solana {
        transfers(
          currency: { in: $fluidCurrencies }
          options: {
            desc: "block.timestamp.unixtime"
            limit: 240
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
          transaction {
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
    fluidCurrencies: string[];
  };
};

type UserTransactionsByTxHashBody = {
  query: string;
  variables: {
    transactions: string[];
  };
};

type UserTransactionsAllBody = {
  query: string;
  variables: {
    fluidCurrencies: string[];
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
  address: string
) => {
  const variables = {
    address: address,
    fluidCurrencies: getTokenForNetwork(network),
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
  transactions: string[]
) => {
  const variables = {
    transactions,
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

const useUserTransactionsAll = async (network: string) => {
  const variables = {
    fluidCurrencies: getTokenForNetwork(network),
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
