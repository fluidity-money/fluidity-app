import { gql, Queryable, getTokenForNetwork, jsonPost } from "~/util";

const queryByAddress: Queryable = {
  ethereum: gql`
    query getTransactionCount($fluidCurrencies: [String!], $address: String!) {
      ethereum {
        transfers(
          currency: { in: $fluidCurrencies }
          any: [{ sender: { is: $address } }, { receiver: { is: $address } }]
        ) {
          count
        }
      }
    }
  `,
  solana: gql`
    query getTransactionCount($fluidCurrencies: [String!], $address: String!) {
      solana {
        transfers(
          currency: { in: $fluidCurrencies }
          any: [
            { senderAddress: { is: $address } }
            { receiverAddress: { is: $address } }
          ]
        ) {
          count
        }
      }
    }
  `,
};

const queryAll: Queryable = {
  ethereum: gql`
    query getTransactionCount($fluidCurrencies: [String!]) {
      ethereum {
        transfers(currency: { in: $fluidCurrencies }) {
          count
        }
      }
    }
  `,
  solana: gql`
    query getTransactionCount($fluidCurrencies: [String!]) {
      solana {
        transfers(currency: { in: $fluidCurrencies }) {
          count
        }
      }
    }
  `,
};

type UserTransactionCountByAddressBody = {
  query: string;
  variables: {
    address: string;
    fluidCurrencies: string[];
  };
};

type UserTransactionCountAllBody = {
  query: string;
  variables: {
    fluidCurrencies: string[];
  };
};

export type UserTransactionCountRes = {
  data?: {
    [network: string]: {
      transfers: {
        count: number;
      }[];
    };
  };
  errors?: unknown;
};

const useUserTransactionByAddressCount = (network: string, address: string) => {
  const variables = {
    address: address,
    fluidCurrencies: getTokenForNetwork(network),
  };

  const body = {
    query: queryByAddress[network],
    variables,
  };

  return jsonPost<UserTransactionCountByAddressBody, UserTransactionCountRes>(
    "https://graphql.bitquery.io",
    body,
    {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
    }
  );
};

const useUserTransactionAllCount = (network: string) => {
  const variables = {
    fluidCurrencies: getTokenForNetwork(network),
  };

  const body = {
    query: queryAll[network],
    variables,
  };

  return jsonPost<UserTransactionCountAllBody, UserTransactionCountRes>(
    "https://graphql.bitquery.io",
    body,
    {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
    }
  );
};

export { useUserTransactionAllCount, useUserTransactionByAddressCount };
