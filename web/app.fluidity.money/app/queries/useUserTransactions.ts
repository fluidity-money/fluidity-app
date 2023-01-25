import Moralis from "moralis";
import MoralisUtils from "@moralisweb3/common-evm-utils";
import { gql, Queryable, jsonPost } from "~/util";
import { Chain, resolveMoralisChainName } from "~/util/chainUtils/chains";

const queryByAddress: Queryable = {
  ethereum: gql`
    query getTransactionsByAddress(
      $tokens: [String!]
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      ethereum {
        transfers(
          currency: { in: $tokens }
          any: [{ sender: { is: $address } }, { receiver: { is: $address } }]
          options: {
            desc: "block.timestamp.unixtime"
            limit: $limit
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
          transaction(txHash: { notIn: $filterHashes }) {
            hash
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
    query getTransactionsByAddress(
      $tokens: [String!]
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      solana {
        transfers(
          currency: { in: $tokens }
          any: [
            { senderAddress: { is: $address } }
            { receiverAddress: { is: $address } }
          ]
          options: {
            desc: "block.timestamp.unixtime"
            limit: $limit
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
          transaction(txHash: { notIn: $filterHashes }) {
            hash: signature
          }
        }
      }
    }
  `,
};

const queryByTxHash: Queryable = {
  ethereum: gql`
    query getTransactionsByTxHash(
      $transactions: [String!]
      $filterHashes: [String!] = []
      $tokens: [String!] = []
      $limit: Int = 12
    ) {
      ethereum {
        transfers(
          options: { desc: "block.timestamp.unixtime", limit: $limit }
          txHash: { in: $transactions }
          currency: { in: $tokens }
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
          transaction(txHash: { notIn: $filterHashes }) {
            hash
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
    query getTransactionsByTxHash(
      $transactions: [String!]
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      solana {
        transfers(
          options: { desc: "block.timestamp.unixtime", limit: $limit }
          signature: { in: $transactions }
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
          transaction(txHash: { notIn: $filterHashes }) {
            hash: signature
          }
        }
      }
    }
  `,
};

const queryAll: Queryable = {
  ethereum: gql`
    query getTransactions(
      $tokens: [String!]
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      ethereum {
        transfers(
          currency: { in: $tokens }
          options: {
            desc: "block.timestamp.unixtime"
            limit: $limit
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
          transaction(txHash: { notIn: $filterHashes }) {
            hash
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
      $tokens: [String!]
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      solana {
        transfers(
          currency: { in: $tokens }
          options: {
            desc: "block.timestamp.unixtime"
            limit: $limit
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
          transaction(txHash: { notIn: $filterHashes }) {
            hash: signature
          }
        }
      }
    }
  `,
};

type UserTransactionsByAddressBody = {
  query: string;
  variables: {
    address: string;
    offset: number;
    tokens: string[];
    filterHashes?: string[];
  };
};

type UserTransactionsByTxHashBody = {
  query: string;
  variables: {
    transactions: string[];
    filterHashes?: string[];
  };
};

type UserTransactionsAllBody = {
  query: string;
  variables: {
    offset: number;
    tokens: string[];
    filterHashes?: string[];
  };
};

export type UserTransactionsRes = {
  data?: {
    [network: string]: {
      transfers: UserTransaction[];
    };
  };
  errors?: unknown;
};

export type UserTransaction = {
  sender: {
    address: string;
  };
  receiver: { address: string };
  block: { timestamp: { unixtime: number } };
  transaction: { hash: string };
  amount: string | number;
  currency: { symbol: string };
};

const useUserTransactionsByAddress = async (
  network: string,
  // address: token symbol
  tokens: { [address: string]: string },
  page: number,
  address: string,
  filterHashes: string[],
  useMoralis = true,
  limit = 12
): Promise<UserTransactionsRes> => {
  const offset = (page - 1) * 12;

  const variables = {
    address: address,
    offset,
    tokens: Object.keys(tokens),
    filterHashes,
    limit,
  };

  switch (true) {
    case network === "arbitrum":
    case network === "ethereum" && useMoralis: {
      // fetch first page of transfers since <=12 are needed
      const transfers = await Moralis.EvmApi.token.getWalletTokenTransfers({
        address,
        chain: resolveMoralisChainName(network as Chain),
      });

      const filteredTransactions: UserTransactionsRes = {
        data: {
          ethereum: {
            transfers: transfers.result
              .filter(
                (t) =>
                  // is a fluid token
                  Object.keys(tokens).includes(t.address.checksum) &&
                  // is not a filtered hash
                  !filterHashes.includes(t.transactionHash) &&
                  // address is sender or receiver
                  (t.fromAddress.equals(address) || t.toAddress.equals(address))
              )
              .slice(offset, offset + limit)
              .map((t) => ({
                sender: { address: t.fromAddress.format() },
                receiver: { address: t.toAddress.format() },
                block: {
                  timestamp: { unixtime: new Date(t.blockTimestamp).getTime() },
                },
                transaction: { hash: t.transactionHash },
                amount: t.value.toString(),
                currency: { symbol: tokens[t.address.checksum] },
              })),
          },
        },
      };

      return filteredTransactions;
    }

    case network === "ethereum":
    case network === "solana": {
      const body = {
        query: queryByAddress[network],
        variables,
      };

      return jsonPost<UserTransactionsByAddressBody, UserTransactionsRes>(
        "https://graphql.bitquery.io",
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

const useUserTransactionsByTxHash = async (
  network: string,
  transactions: string[],
  filterHashes: string[],
  // address: token symbol
  tokens: { [address: string]: string },
  useMoralis = true,
  limit = 12
) => {
  switch (true) {
    case network === "arbitrum":
    case network === "ethereum" && useMoralis: {
      const transfers = (
        await Promise.all(
          Object.keys(tokens)
            // fetch all transfers for all tokens
            .map(async (address) => {
              let cursor: string | undefined;
              const transfers: MoralisUtils.Erc20Transfer[] = [];
              do {
                try {
                  const response = await Moralis.EvmApi.token.getTokenTransfers(
                    {
                      address: address,
                    }
                  );
                  transfers.push(...response.result);
                  cursor = response.pagination.cursor;
                } catch (e) {
                  console.error(e);
                  break;
                }
              } while (cursor);

              return transfers;
            })
          // flatten into single array
        )
      )
        .flat()
        .filter(
          (transfer) =>
            // is one of the given transactions
            transactions.includes(transfer.transactionHash) &&
            // is not a filtered hash
            !filterHashes.includes(transfer.transactionHash)
        )
        // sort descending by block timestamp
        .sort(
          (a, b) =>
            new Date(b.blockTimestamp).getTime() -
            new Date(a.blockTimestamp).getTime()
          // avoid unnecessary processing as soon as possible
        )
        .slice(0, limit);

      const filteredTransactions: UserTransactionsRes = {
        data: {
          ethereum: {
            transfers: transfers.map((t) => ({
              sender: { address: t.fromAddress.format() },
              receiver: { address: t.toAddress.format() || "" },
              block: {
                timestamp: {
                  unixtime: new Date(t.blockTimestamp).getTime() / 1000,
                },
              },
              transaction: { hash: t.transactionHash },
              amount: t.value.toString(),
              currency: { symbol: tokens[t.address.checksum] },
            })),
          },
        },
      };
      return filteredTransactions;
    }

    case network === "ethereum":
    case network === "solana": {
      const variables = {
        transactions,
        filterHashes,
      };

      const body = {
        query: queryByTxHash[network],
        variables,
      };

      return jsonPost<UserTransactionsByTxHashBody, UserTransactionsRes>(
        "https://graphql.bitquery.io",
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

const useUserTransactionsAll = async (
  network: string,
  // address: token symbol
  tokens: { [address: string]: string },
  page: number,
  filterHashes: string[],
  useMoralis = true,
  limit = 12
) => {
  const offset = (page - 1) * 12;

  switch (true) {
    case network === "arbitrum":
    case network === "ethereum" && useMoralis: {
      const transfers = (
        await Promise.all(
          Object.keys(tokens)
            // fetch first page of transfers for all tokens
            .map(
              async (address) =>
                (
                  await Moralis.EvmApi.token.getTokenTransfers({
                    address: address,
                  })
                ).result
            )
          // flatten into single array
        )
      )
        .flat()
        // filter ignored hashes
        .filter((transfer) => !filterHashes.includes(transfer.transactionHash))
        // sort descending by block timestamp
        .sort(
          (a, b) =>
            new Date(b.blockTimestamp).getTime() -
            new Date(a.blockTimestamp).getTime()
          // avoid unnecessary processing as soon as possible
        )
        .slice(offset, offset + limit);

      const filteredTransactions: UserTransactionsRes = {
        data: {
          ethereum: {
            transfers: transfers.map((t) => ({
              sender: { address: t.fromAddress.format() },
              receiver: { address: t.toAddress.format() || "" },
              block: {
                timestamp: {
                  unixtime: new Date(t.blockTimestamp).getTime() / 1000,
                },
              },
              transaction: { hash: t.transactionHash },
              amount: t.value.toString(),
              currency: { symbol: tokens[t.address.checksum] },
            })),
          },
        },
      };
      return filteredTransactions;
    }

    case network === "ethereum":
    case network === "solana": {
      const variables = {
        tokens: Object.values(tokens),
        offset,
        filterHashes,
        limit,
      };

      const body = {
        query: queryAll[network],
        variables,
      };

      return jsonPost<UserTransactionsAllBody, UserTransactionsRes>(
        "https://graphql.bitquery.io",
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

export {
  useUserTransactionsAll,
  useUserTransactionsByAddress,
  useUserTransactionsByTxHash,
};
