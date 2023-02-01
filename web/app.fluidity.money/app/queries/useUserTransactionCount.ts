import { gql, Queryable, getTokenForNetwork, jsonPost } from "~/util";
import {fetchGqlEndpoint} from "~/util/api/graphql";

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

const useUserTransactionByAddressCount = async(network: string, address: string) => {
  const variables = {
    address: address,
    fluidCurrencies: getTokenForNetwork(network),
  };

  const body = {
    query: queryByAddress[network],
    variables,
  };

  const {url, headers} = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {errors: `Failed to fetch GraphQL URL and headers for network ${network}`}

  const result = await jsonPost<UserTransactionCountByAddressBody, UserTransactionCountRes>(
    url,
    body,
    headers,
  );

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    result.data[network].transfers = (result as any).data.transfers;
  }

  return result; 
};

const useUserTransactionAllCount = async(network: string) => {
  const variables = {
    fluidCurrencies: getTokenForNetwork(network),
  };

  const body = {
    query: queryAll[network],
    variables,
  };

  const {url, headers} = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {errors: `Failed to fetch GraphQL URL and headers for network ${network}`}

  const result = await jsonPost<UserTransactionCountAllBody, UserTransactionCountRes>(
    url,
    body,
    headers,
  );

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    result.data[network].transfers = (result as any).data.transfers;
  }

  return result; 
};

export { useUserTransactionAllCount, useUserTransactionByAddressCount };
