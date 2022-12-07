import { gql, jsonPost } from "~/util";

const queryByAddressTimestamp = gql`
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
`;

const queryByTimestamp = gql`
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
`;

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
    ethereum: {
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
  fluidAssets: string[],
  address: string,
  iso8601Timestamp: string
) => {
  const variables = { fluidAssets, address, timestamp: iso8601Timestamp };
  const url = "https://graphql.bitquery.io";
  const body = {
    variables,
    query: queryByAddressTimestamp,
  };

  return jsonPost<VolumeTxsBodyByAddressTimestamp, VolumeTxsResponse>(
    url,
    body,
    {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
    }
  );
};

const useVolumeTxByTimestamp = async (
  fluidAssets: string[],
  iso8601Timestamp: string
) => {
  const variables = { fluidAssets, timestamp: iso8601Timestamp };
  const url = "https://graphql.bitquery.io";
  const body = {
    variables,
    query: queryByTimestamp,
  };

  return jsonPost<VolumeTxsBodyByTimestamp, VolumeTxsResponse>(url, body, {
    "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
  });
};

export { useVolumeTxByTimestamp, useVolumeTxByAddressTimestamp };
