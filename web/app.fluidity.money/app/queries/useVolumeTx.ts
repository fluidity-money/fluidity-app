import { gql, jsonPost, Queryable } from "~/util";
import {fetchGqlEndpoint} from "~/util/api/graphql";

const queryByAddressTimestamp: Queryable = {
  ethereum: gql`
  query VolumeTxs(
    $fluidAssets: [String!]
    $address: String!
    $timestamp: ISO8601DateTime!
  ) {
    ethereum {
      transfers(
        currency: { in: $fluidAssets }
        any: [{ sender: { is: $address } }, { receiver: { is: $address } }]
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
        block(time: { after: $timestamp }) {
          timestamp {
            unixtime
          }
        }
      }
    }
  }
`
};

const queryByTimestamp: Queryable = {
  ethereum: gql`
  query VolumeTxs($fluidAssets: [String!], $timestamp: ISO8601DateTime!) {
    ethereum {
      transfers(
        currency: { in: $fluidAssets }

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
        block(time: { after: $timestamp }) {
          timestamp {
            unixtime
          }
        }
      }
    }
  }
`
};

type VolumeTxsBodyByTimestamp = {
  query: string;
  variables: {
    fluidAssets: string[];
    timestamp: string;
  };
};

type VolumeTxsBodyByAddressTimestamp = {
  query: string;
  variables: {
    fluidAssets: string[];
    address: string;
    timestamp: string;
  };
};

export type VolumeTxsResponse = {
  data: {
    [network: string]: {
      transfers: [
        {
          amount: string;
          currency: {
            symbol: string;
          };
          sender: {
            address: string;
          };
          receiver: {
            address: string;
          };
          block: {
            timestamp: {
              unixtime: number;
            };
          };
        }
      ];
    };
  };
};

const useVolumeTxByAddressTimestamp = async (
  network: string,
  fluidAssets: string[],
  address: string,
  iso8601Timestamp: string,
) => {
  const variables = { fluidAssets, address, timestamp: iso8601Timestamp };
  const body = {
    variables,
    query: queryByAddressTimestamp[network],
  };

  const {url, headers} = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {errors: `Failed to fetch GraphQL URL and headers for network ${network}`}

  const result = await jsonPost<VolumeTxsBodyByAddressTimestamp, VolumeTxsResponse>(
    url,
    body,
    headers, 
  );

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    result.data[network].transfers = (result as any).data.transfers;
  }
};

const useVolumeTxByTimestamp = async (
  network: string,
  fluidAssets: string[],
  iso8601Timestamp: string,
) => {
  const variables = { fluidAssets, timestamp: iso8601Timestamp };
  const body = {
    variables,
    query: queryByTimestamp[network],
  };

  const {url, headers} = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {errors: `Failed to fetch GraphQL URL and headers for network ${network}`}

  const result = await jsonPost<VolumeTxsBodyByTimestamp, VolumeTxsResponse>(
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

export { useVolumeTxByTimestamp, useVolumeTxByAddressTimestamp };
