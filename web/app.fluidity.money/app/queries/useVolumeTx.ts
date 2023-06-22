import { gql, jsonPost, Queryable } from "~/util";
import { fetchGqlEndpoint, hasuraDateToUnix } from "~/util/api/graphql";
import { getUsdFromTokenAmount } from "~/util/chainUtils/tokens";
import BN from "bn.js";

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
  `,
  arbitrum: gql`
    query VolumeTxs(
      $address: String!
      $filterHashes: [String!] = []
      $timestamp: timestamp!
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "arbitrum" }
          _not: { transaction_hash: { _in: $filterHashes } }
          time: { _gt: $timestamp }
          _or: [
            { sender_address: { _eq: $address } }
            { recipient_address: { _eq: $address } }
          ]
        }
        order_by: { time: desc }
      ) {
        sender_address
        recipient_address
        token_short_name
        token_decimals
        time
        transaction_hash
        amount_str
      }
    }
  `,
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
  `,

  arbitrum: gql`
    query VolumeTxs($filterHashes: [String!] = [], $timestamp: timestamp!) {
      transfers: user_actions(
        where: {
          network: { _eq: "arbitrum" }
          _not: { transaction_hash: { _in: $filterHashes } }
          time: { _gt: $timestamp }
        }
        order_by: { time: desc }
      ) {
        sender_address
        recipient_address
        token_short_name
        token_decimals
        time
        transaction_hash
        amount_str
      }
    }
  `,
};

type VolumeTxsBodyByTimestamp = {
  query: string;
  variables: {
    fluidAssets?: string[];
    timestamp: string;
  };
};

type VolumeTxsBodyByAddressTimestamp = {
  query: string;
  variables: {
    fluidAssets?: string[];
    address: string;
    timestamp: string;
  };
};

export type VolumeTxsResponse = {
  data?: {
    [network: string]: {
      transfers: {
        amount: string | number;
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
      }[];
    };
  };
  errors?: unknown;
};

export type HasuraVolumeTransaction = {
  sender_address: string;
  recipient_address: string;
  amount_str: string;
  token_short_name: string;
  token_decimals: number;
  time: number;
};

export type HasuraVolumeTxsResponse = {
  data: { transfers?: HasuraVolumeTransaction[] };
};

const useVolumeTxByAddressTimestamp = async (
  network: string,
  fluidAssets: string[],
  address: string,
  iso8601Timestamp: string
) => {
  const variables = {
    address,
    timestamp: iso8601Timestamp,
    ...(network !== "arbitrum" && { fluidAssets }),
  };

  const body = {
    variables,
    query: queryByAddressTimestamp[network],
  };

  const { url, headers } = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {
      errors: `Failed to fetch GraphQL URL and headers for network ${network}`,
    };

  const result = await jsonPost<
    VolumeTxsBodyByAddressTimestamp,
    VolumeTxsResponse
  >(url, body, headers);

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    const hasuraTransfers =
      (result as HasuraVolumeTxsResponse).data.transfers || [];
    result.data = {
      arbitrum: {
        transfers: hasuraTransfers.map((transfer) => ({
          sender: { address: transfer.sender_address },
          receiver: { address: transfer.recipient_address },
          amount: getUsdFromTokenAmount(
            new BN(transfer.amount_str),
            transfer.token_decimals
          ),
          currency: { symbol: "f" + transfer.token_short_name },
          block: { timestamp: { unixtime: hasuraDateToUnix(transfer.time) } },
        })),
      },
    };
  }

  return result;
};

const useVolumeTxByTimestamp = async (
  network: string,
  fluidAssets: string[],
  iso8601Timestamp: string
) => {
  const variables = {
    timestamp: iso8601Timestamp,
    ...(network !== "arbitrum" && { fluidAssets }),
  };

  const body = {
    variables,
    query: queryByTimestamp[network],
  };

  const { url, headers } = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {
      errors: `Failed to fetch GraphQL URL and headers for network ${network}`,
    };

  const result = await jsonPost<VolumeTxsBodyByTimestamp, VolumeTxsResponse>(
    url,
    body,
    headers
  );

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    const hasuraTransfers =
      (result as HasuraVolumeTxsResponse).data.transfers || [];
    result.data = {
      arbitrum: {
        transfers: hasuraTransfers.map((transfer) => ({
          sender: { address: transfer.sender_address },
          receiver: { address: transfer.recipient_address },
          amount: getUsdFromTokenAmount(
            new BN(transfer.amount_str),
            transfer.token_decimals
          ),
          currency: { symbol: "f" + transfer.token_short_name },
          block: { timestamp: { unixtime: hasuraDateToUnix(transfer.time) } },
        })),
      },
    };
  }

  return result;
};

export { useVolumeTxByTimestamp, useVolumeTxByAddressTimestamp };
