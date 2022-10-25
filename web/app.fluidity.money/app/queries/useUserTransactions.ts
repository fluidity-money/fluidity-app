import { getTokenForNetwork, gql, Queryable } from "~/util";

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
  return fetch("https://graphql.bitquery.io", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query[network],
      variables,
    }),
  });
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

export default useUserTransactions;
