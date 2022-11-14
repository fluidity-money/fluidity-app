import { getTokenForNetwork, gql, Queryable, jsonPost } from "~/util";

const queryByAddress: Queryable = {
  ethereum: gql`
    query getTransactions(
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
    query getTransactions(
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
    query getTransactions($fluidCurrencies: [String!]) {
      ethereum {
        transfers(
          currency: { in: $fluidCurrencies }
          options: { desc: "block.timestamp.unixtime" }
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
            hash
          }
        }
      }
    }
  `,

  solana: gql`
    query getTransactions($fluidCurrencies: [String!]) {
      solana {
        transfers(
          currency: { in: $fluidCurrencies }
          options: { desc: "block.timestamp.unixtime" }
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
    offset: number;
    fluidCurrencies: string[];
  };
};

type UserTransactionsAllBody = {
  query: string;
  variables: {
    offset: number;
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
  address: string,
  page = 1
) => {
  const variables = {
    address: address,
    offset: (page - 1) * 12,
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

const useUserTransactionsAll = async (network: string, page = 1) => {
  const variables = {
    offset: (page - 1) * 12,
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

export { useUserTransactionsAll, useUserTransactionsByAddress };
