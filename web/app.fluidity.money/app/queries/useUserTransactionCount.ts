import { gql, Queryable, getTokenForNetwork, jsonPost } from "~/util";
import { fetchGqlEndpoint } from "~/util/api/graphql";

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
  arbitrum: gql`
    query getTransactionCount($address: String!, $timestamp: timestamp!) {
      arbitrum: user_actions_aggregate(
        where: {
          network: { _eq: "arbitrum" }
          sender_address: { _eq: $address }
          _or: { recipient_address: { _eq: $address } }
          time: { _gt: $timestamp }
        }
      ) {
        aggregate {
          count
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
  arbitrum: gql`
    query getTransactionCount($timestamp: timestamp!) {
      arbitrum: user_actions_aggregate(
        where: { network: { _eq: "arbitrum" }, time: { _gt: $timestamp } }
      ) {
        aggregate {
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
    fluidCurrencies?: string[];
  };
};

type UserTransactionCountAllBody = {
  query: string;
  variables: {
    fluidCurrencies?: string[];
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

export type HasuraUserTransactionCountRes = {
  data: {
    [network: string]: {
      count: number;
    };
  };
  errors?: unknown;
};

const useUserTransactionCountByAddressTimestamp = async (
  network: string,
  address: string,
  iso8601Timestamp: string
) => {
  const variables = {
    address: address,
    ...(network !== "arbitrum" && {
      fluidCurrencies: getTokenForNetwork(network),
    }),
    fluidCurrencies: getTokenForNetwork(network),
    timestamp: iso8601Timestamp,
  };

  const body = {
    query: queryByAddressTimestamp[network],
    variables,
  };

  const { url, headers } = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {
      errors: `Failed to fetch GraphQL URL and headers for network ${network}`,
    };

  const result = await jsonPost<
    UserTransactionCountByAddressBody,
    UserTransactionCountRes
  >(url, body, headers);

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    result.data[network].transfers = [
      (result as unknown as HasuraUserTransactionCountRes).data.aggregate,
    ];
  }

  return result;
};

const useUserTransactionCountByTimestamp = async (
  network: string,
  iso8601Timestamp: string
) => {
  const variables = {
    ...(network !== "arbitrum" && {
      fluidCurrencies: getTokenForNetwork(network),
    }),
    timestamp: iso8601Timestamp,
  };

  const body = {
    query: queryByTimestamp[network],
    variables,
  };

  const { url, headers } = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {
      errors: `Failed to fetch GraphQL URL and headers for network ${network}`,
    };

  const result = await jsonPost<
    UserTransactionCountAllBody,
    UserTransactionCountRes
  >(url, body, headers);

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    result.data[network].transfers = [
      (result as unknown as HasuraUserTransactionCountRes).data.aggregate,
    ];
  }

  return result;
};

export {
  useUserTransactionCountByTimestamp,
  useUserTransactionCountByAddressTimestamp,
};
