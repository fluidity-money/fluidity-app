import { gql } from "~/util";
import config from "~/webapp.config";

const query = gql`
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
`;

const useUserTransactions = async (address: string, page: number = 1) => {
  const variables = {
    address: address,
    offset: (page - 1) * 12,
    fluidCurrencies: config.ethereum.currencies,
  };
  return fetch("https://graphql.bitquery.io", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
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
