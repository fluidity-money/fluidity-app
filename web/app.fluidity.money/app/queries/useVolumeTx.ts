import { gql, jsonPost } from "~/util";
import Moralis from "moralis";
import MoralisUtils from "@moralisweb3/common-evm-utils";

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
  data?: {
    [network: string]: {
      transfers: Array<{
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
      }>;
    };
  };
  errors?: unknown;
};

const useVolumeTxByAddressTimestamp = async (
  network: string,
  // address: token symbol
  fluidAssets: { [address: string]: string },
  address: string,
  iso8601Timestamp: string,
  useMoralis = true
): Promise<VolumeTxsResponse> => {
  switch (true) {
    case network === "arbitrum":
    case network === "ethereum" && useMoralis: {
      let cursor: string | undefined;
      const transfers: MoralisUtils.Erc20Transfer[] = [];
      do {
        const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
          address,
          cursor,
        });
        transfers.push(...response.result);
        cursor = response.pagination.cursor;
      } while (cursor);

      const filteredTransactions: VolumeTxsResponse = {
        data: {
          ethereum: {
            transfers: transfers
              .filter(
                (t) =>
                  // is a fluid token
                  Object.keys(fluidAssets).includes(t.address.format()) &&
                  // address is sender or receiver
                  (t.fromAddress.equals(address) ||
                    t.toAddress.equals(address)) &&
                  // is after timestamp
                  new Date(t.blockTimestamp) > new Date(iso8601Timestamp)
                // sort descending by block timestamp
              )
              .sort(
                (a, b) =>
                  new Date(b.blockTimestamp).getTime() -
                  new Date(a.blockTimestamp).getTime()
              )
              .map((t) => ({
                sender: { address: t.fromAddress.format() },
                receiver: { address: t.toAddress.format() },
                block: {
                  timestamp: { unixtime: new Date(t.blockTimestamp).getTime() },
                },
                amount: t.value.toString(),
                currency: { symbol: fluidAssets[t.address.checksum] },
              })),
          },
        },
      };
      return filteredTransactions;
    }
    case network === "ethereum":
    case network === "solana": {
      const variables = {
        fluidAssets: Object.keys(fluidAssets),
        address,
        timestamp: iso8601Timestamp,
      };
      const url = "https://graphql.bitquery.io";
      const body = {
        variables,
        query: queryByAddressTimestamp,
      };
      return jsonPost<VolumeTxsBodyByAddressTimestamp, VolumeTxsResponse>(
        url,
        body,
        {
          "X-API-KEY": process.env.FLU_BITQUERY_TOKEN ?? "",
        }
      );
    }
    default:
      return {
        errors: `Unsupported network ${network}`,
      };
  }
};

const useVolumeTxByTimestamp = async (
  network: string,
  // address: token symbol
  fluidAssets: { [address: string]: string },
  iso8601Timestamp: string,
  useMoralis = true
) => {
  switch (true) {
    case network === "arbitrum":
    case network === "ethereum" && useMoralis: {
      const transfers = (
        await Promise.all(
          Object.keys(fluidAssets).flatMap(async (address) => {
            let cursor: string | undefined;
            const transfers: MoralisUtils.Erc20Transfer[] = [];
            do {
              const response = await Moralis.EvmApi.token.getTokenTransfers({
                address,
                cursor,
              });
              transfers.push(...response.result);
              cursor = response.pagination.cursor;
            } while (cursor);
            return transfers;
          })
        )
      )
        .filter((t) => !!t)
        .flat() as MoralisUtils.Erc20Transfer[];

      const filteredTransactions: VolumeTxsResponse = {
        data: {
          ethereum: {
            transfers: transfers
              .filter(
                (t) =>
                  // is after timestamp
                  new Date(t.blockTimestamp) > new Date(iso8601Timestamp)
                // sort descending by block timestamp
              )
              .sort(
                (a, b) =>
                  new Date(b.blockTimestamp).getTime() -
                  new Date(a.blockTimestamp).getTime()
              )
              .map((t) => ({
                sender: { address: t.fromAddress.format() },
                receiver: { address: t.toAddress.format() || "" },
                block: {
                  timestamp: { unixtime: new Date(t.blockTimestamp).getTime() },
                },
                transaction: { hash: t.transactionHash },
                amount: t.value.toString(),
                currency: { symbol: fluidAssets[t.address.checksum] },
              })),
          },
        },
      };
      return filteredTransactions;
    }
    case network === "ethereum":
    case network === "solana": {
      const variables = {
        fluidAssets: Object.keys(fluidAssets),
        timestamp: iso8601Timestamp,
      };

      const url = "https://graphql.bitquery.io";
      const body = {
        variables,
        query: queryByTimestamp,
      };
      return jsonPost<VolumeTxsBodyByTimestamp, VolumeTxsResponse>(url, body, {
        "X-API-KEY": process.env.FLU_BITQUERY_TOKEN ?? "",
      });
    }
    default:
      return {
        errors: `Unsupported network ${network}`,
      };
  }
};

export { useVolumeTxByTimestamp, useVolumeTxByAddressTimestamp };
