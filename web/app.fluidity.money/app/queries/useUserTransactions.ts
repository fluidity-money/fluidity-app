import { getTokenForNetwork, gql, Queryable, jsonPost } from "~/util";

const query: Queryable = {
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
        }
      }
    }
  `,
};

type UserTransactionsBody = {
  query: string;
  variables: {
    address: string;
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
  amount: number;
  currency: { symbol: string };
};

const useUserTransactions = async (
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
    query: query[network],
    variables,
  };

  return jsonPost<UserTransactionsBody, UserTransactionsRes>(
    "https://graphql.bitquery.io",
    body,
    {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
    }
  );
};

export default useUserTransactions;
