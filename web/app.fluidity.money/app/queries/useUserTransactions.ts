import { gql, Queryable, jsonPost } from "~/util";
import { fetchGqlEndpoint, hasuraDateToUnix } from "~/util/api/graphql";
import BN from "bn.js";
import { addDecimalToBn } from "~/util/chainUtils/tokens";
import { MintAddress } from "~/types/MintAddress";

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

  arbitrum: gql`
    query getTransactionsByAddress(
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "arbitrum" }
          _not: { transaction_hash: { _in: $filterHashes } }
          _or: [
            { sender_address: { _eq: $address } }
            { recipient_address: { _eq: $address } }
          ]
        }
        order_by: { time: desc }
        limit: $limit
        offset: $offset
      ) {
        sender_address
        recipient_address
        token_short_name
        time
        transaction_hash
        amount
        token_decimals
        type
        swap_in
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

  arbitrum: gql`
    query getTransactionsByTxHash(
      $transactions: [String!]
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "arbitrum" }
          _not: { transaction_hash: { _in: $filterHashes } }
          transaction_hash: { _in: $transactions }
        }
        order_by: { time: desc }
        limit: $limit
      ) {
        sender_address
        recipient_address
        token_short_name
        time
        transaction_hash
        amount
        token_decimals
        type
        swap_in
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

  arbitrum: gql`
    query getTransactions(
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "arbitrum" }
          _not: { transaction_hash: { _in: $filterHashes } }
        }
        order_by: { time: desc }
        limit: $limit
        offset: $offset
      ) {
        sender_address
        recipient_address
        token_short_name
        time
        transaction_hash
        amount
        token_decimals
        type
        swap_in
      }
    }
  `,
};

type UserTransactionsByAddressBody = {
  query: string;
  variables: {
    address: string;
    offset: number;
    tokens?: string[];
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
    tokens?: string[];
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
  amount: number;
  currency: { symbol: string };
};

export type HasuraUserTransaction = {
  sender_address: string;
  recipient_address: string;
  amount: number;
  token_decimals: number;
  token_short_name: string;
  transaction_hash: string;
  time: string;
  type: "swap" | "send";
  swap_in: boolean;
};

export type HasuraUserTransactionRes = {
  data: { transfers: HasuraUserTransaction[] };
};

const useUserTransactionsByAddress = async (
  network: string,
  tokens: string[],
  page: number,
  address: string,
  filterHashes: string[],
  limit = 12
) => {
  const variables = {
    address: address,
    offset: (page - 1) * 12,
    filterHashes,
    limit,
    ...(network !== "arbitrum" && { tokens }),
  };

  const body = {
    query: queryByAddress[network],
    variables,
  };

  const { url, headers } = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {
      errors: `Failed to fetch GraphQL URL and headers for network ${network}`,
    };

  const result = await jsonPost<
    UserTransactionsByAddressBody,
    UserTransactionsRes
  >(url, body, headers);

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    const hasuraTransfers = (result as unknown as HasuraUserTransactionRes).data
      .transfers;

    const arbParsedTransfers = hasuraTransfers.map((transfer) => {
      let senderAddress = "";
      let recipientAddress = "";

      // only senderAddress is defined by user actions
      switch (transfer.type) {
        case "send":
          senderAddress = transfer.sender_address;
          recipientAddress = transfer.recipient_address;
          break;
        case "swap":
          if (transfer.swap_in) {
            senderAddress = MintAddress;
            recipientAddress = transfer.sender_address;
          } else {
            senderAddress = transfer.sender_address;
            recipientAddress = MintAddress;
          }
          break;
      }

      return {
        sender: { address: senderAddress },
        receiver: { address: recipientAddress },
        amount: parseFloat(
          addDecimalToBn(
            new BN(String(transfer.amount)),
            transfer.token_decimals
          )
        ),
        currency: { symbol: "f" + transfer.token_short_name },
        transaction: { hash: transfer.transaction_hash },
        block: { timestamp: { unixtime: hasuraDateToUnix(transfer.time) } },
      };
    });

    return {
      data: {
        [network]: {
          transfers: arbParsedTransfers,
        },
      },
    };
  }

  return result;
};

const useUserTransactionsByTxHash = async (
  network: string,
  transactions: string[],
  filterHashes: string[],
  tokens: string[],
  limit = 12
): Promise<UserTransactionsRes> => {
  const variables = {
    transactions,
    filterHashes,
    limit,
    ...(network !== "arbitrum" && { tokens }),
  };

  const body = {
    query: queryByTxHash[network],
    variables,
  };

  const { url, headers } = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {
      errors: `Failed to fetch GraphQL URL and headers for network ${network}`,
    };

  const result = await jsonPost<
    UserTransactionsByTxHashBody,
    UserTransactionsRes
  >(url, body, headers);

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && !!result.data) {
    const {
      data: { transfers: hasuraTransfers },
    } = result as unknown as HasuraUserTransactionRes;

    const arbParsedTransfers = hasuraTransfers.map((transfer) => {
      let senderAddress = "";
      let recipientAddress = "";
      // only senderAddress is defined by user actions
      switch (transfer.type) {
        case "send":
          senderAddress = transfer.sender_address;
          recipientAddress = transfer.recipient_address;
          break;
        case "swap":
          if (transfer.swap_in) {
            senderAddress = MintAddress;
            recipientAddress = transfer.sender_address;
          } else {
            senderAddress = transfer.sender_address;
            recipientAddress = MintAddress;
          }
          break;
      }

      return {
        sender: { address: senderAddress },
        receiver: { address: recipientAddress },
        amount: Number(
          addDecimalToBn(
            new BN(String(transfer.amount)),
            transfer.token_decimals
          )
        ),
        currency: { symbol: "f" + transfer.token_short_name },
        transaction: { hash: transfer.transaction_hash },
        block: { timestamp: { unixtime: hasuraDateToUnix(transfer.time) } },
      };
    });

    return {
      ...result,
      data: {
        ...result.data,
        arbitrum: {
          ...result.data.arbitrum,
          transfers: arbParsedTransfers,
        },
      },
    };
  }

  return result;
};

const useUserTransactionsAll = async (
  network: string,
  tokens: string[],
  page: number,
  filterHashes: string[],
  limit = 12
) => {
  const variables = {
    offset: (page - 1) * 12,
    filterHashes,
    limit,
    ...(network !== "arbitrum" && { tokens }),
  };

  const body = {
    query: queryAll[network],
    variables,
  };

  const { url, headers } = fetchGqlEndpoint(network) || {};

  if (!url || !headers)
    return {
      errors: `Failed to fetch GraphQL URL and headers for network ${network}`,
    };

  const result = await jsonPost<UserTransactionsAllBody, UserTransactionsRes>(
    url,
    body,
    headers
  );

  // data from hasura isn't nested, and graphql doesn't allow nesting with aliases
  // https://github.com/graphql/graphql-js/issues/297
  if (network === "arbitrum" && result.data) {
    const hasuraTransfers = (result as unknown as HasuraUserTransactionRes).data
      .transfers;

    result.data = {
      arbitrum: {
        transfers: hasuraTransfers.map((transfer) => {
          let senderAddress = "";
          let recipientAddress = "";
          // only senderAddress is defined by user actions
          switch (transfer.type) {
            case "send":
              senderAddress = transfer.sender_address;
              recipientAddress = transfer.recipient_address;
              break;
            case "swap":
              if (transfer.swap_in) {
                senderAddress = MintAddress;
                recipientAddress = transfer.sender_address;
              } else {
                senderAddress = transfer.sender_address;
                recipientAddress = MintAddress;
              }
              break;
          }
          return {
            sender: { address: senderAddress },
            receiver: { address: recipientAddress },
            amount: Number(
              addDecimalToBn(
                new BN(String(transfer.amount)),
                transfer.token_decimals
              )
            ),
            currency: { symbol: "f" + transfer.token_short_name },
            transaction: { hash: transfer.transaction_hash },
            block: {
              timestamp: { unixtime: hasuraDateToUnix(transfer.time) },
            },
          };
        }),
      },
    };
  }

  return result;
};

export {
  useUserTransactionsAll,
  useUserTransactionsByAddress,
  useUserTransactionsByTxHash,
};
