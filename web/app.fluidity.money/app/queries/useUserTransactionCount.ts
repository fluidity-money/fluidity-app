import { gql, Queryable, getTokenForNetwork, jsonPost } from "~/util";

const queryByAddressTimestamp: Queryable = {
  ethereum: gql`
    query getTransactionCount(
      $fluidCurrencies: [String!]
      $address: String!
      $timestamp: ISO8601DateTime!
    ) {
      ethereum {
        transfers(
          currency: { in: $fluidCurrencies }
          any: [{ sender: { is: $address } }, { receiver: { is: $address } }]
        ) {
          count(time: { after: $timestamp })
        }
      }
    }
  `,
  solana: gql`
    query getTransactionCount(
      $fluidCurrencies: [String!]
      $address: String!
      $timestamp: ISO8601DateTime!
    ) {
      solana {
        transfers(
          currency: { in: $fluidCurrencies }
          any: [
            { senderAddress: { is: $address } }
            { receiverAddress: { is: $address } }
          ]
        ) {
          count(time: { after: $timestamp })
        }
      }
    }
  `,
};

const queryByTimestamp: Queryable = {
  ethereum: gql`
    query getTransactionCount(
      $fluidCurrencies: [String!]
      $timestamp: ISO8601DateTime!
    ) {
      ethereum {
        transfers(currency: { in: $fluidCurrencies }) {
          count(time: { after: $timestamp })
        }
      }
    }
  `,
  solana: gql`
    query getTransactionCount(
      $fluidCurrencies: [String!]
      $timestamp: ISO8601DateTime!
    ) {
      solana {
        transfers(currency: { in: $fluidCurrencies }) {
          count(time: { after: $timestamp })
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

const useUserTransactionCountByAddressTimestamp = (
  network: string,
  address: string,
  iso8601Timestamp: string
) => {
  const variables = {
    address: address,
    fluidCurrencies: getTokenForNetwork(network),
    timestamp: iso8601Timestamp,
  };

  const body = {
    query: queryByAddressTimestamp[network],
    variables,
  };

  return jsonPost<UserTransactionCountByAddressBody, UserTransactionCountRes>(
    "https://graphql.bitquery.io",
    body,
    {
      "X-API-KEY": process.env.FLU_BITQUERY_TOKEN ?? "",
    }
  );
};

const useUserTransactionCountByTimestamp = (
  network: string,
  iso8601Timestamp: string
) => {
  const variables = {
    fluidCurrencies: getTokenForNetwork(network),
    timestamp: iso8601Timestamp,
  };

  const body = {
    query: queryByTimestamp[network],
    variables,
  };

  return jsonPost<UserTransactionCountAllBody, UserTransactionCountRes>(
    "https://graphql.bitquery.io",
    body,
    {
      "X-API-KEY": process.env.FLU_BITQUERY_TOKEN ?? "",
    }
  );
};

export {
  useUserTransactionCountByTimestamp,
  useUserTransactionCountByAddressTimestamp,
};
