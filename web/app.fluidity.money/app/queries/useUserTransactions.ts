import { gql, Queryable, jsonPost } from "~/util";
import { fetchGqlEndpoint, hasuraDateToUnix, networkGqlBackend } from "~/util/api/graphql";
import BN from "bn.js";
import {
  addDecimalToBn,
  getTokenFromAddress,
  Token,
} from "~/util/chainUtils/tokens";
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

  arbitrum: gql`
    query getTransactionsByAddress(
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
      $tokens: [String!] = []
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "arbitrum" }
          token_short_name: { _in: $tokens }
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
        application
      }
    }
  `,

  solana: gql`
    query getTransactionsByAddress(
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
      $tokens: [String!] = []
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "solana" }
          token_short_name: { _in: $tokens }
          _not: { transaction_hash: { _in: $filterHashes } }
          _or: [
            { solana_sender_owner_address: { _eq: $address } }
            { solana_recipient_owner_address: { _eq: $address } }
          ]
        }
        order_by: { time: desc }
        limit: $limit
        offset: $offset
      ) {
        sender_address: solana_sender_owner_address
        recipient_address: solana_recipient_owner_address
        token_short_name
        time
        transaction_hash
        amount
        token_decimals
        type
        swap_in
        application
      }
    }
  `,

  polygon_zk: gql`
    query getTransactionsByAddress(
      $address: String!
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
      $tokens: [String!] = []
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "polygon_zk" }
          token_short_name: { _in: $tokens }
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
        application
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
        application
      }
    }
  `,

  solana: gql`
    query getTransactionsByTxHash(
      $transactions: [String!]
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "solana" }
          _not: { transaction_hash: { _in: $filterHashes } }
          transaction_hash: { _in: $transactions }
        }
        order_by: { time: desc }
        limit: $limit
      ) {
        sender_address: solana_sender_owner_address
        recipient_address: solana_recipient_owner_address
        token_short_name
        time
        transaction_hash
        amount
        token_decimals
        type
        swap_in
        application
      }
    }
  `,

  polygon_zk: gql`
    query getTransactionsByTxHash(
      $transactions: [String!]
      $filterHashes: [String!] = []
      $limit: Int = 12
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "polygon_zk" }
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
        application
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

  arbitrum: gql`
    query getTransactions(
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
      $tokens: [String!] = []
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "arbitrum" }
          _not: { transaction_hash: { _in: $filterHashes } }
          token_short_name: { _in: $tokens }
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
        application
      }
    }
  `,

  solana: gql`
    query getTransactions(
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
      $tokens: [String!] = []
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "solana" }
          _not: { transaction_hash: { _in: $filterHashes } }
          token_short_name: { _in: $tokens }
        }
        order_by: { time: desc }
        limit: $limit
        offset: $offset
      ) {
        sender_address: solana_sender_owner_address
        recipient_address: solana_recipient_owner_address
        token_short_name
        time
        transaction_hash
        amount
        token_decimals
        type
        swap_in
        application
      }
    }
  `,

  polygon_zk: gql`
    query getTransactions(
      $offset: Int = 0
      $filterHashes: [String!] = []
      $limit: Int = 12
      $tokens: [String!] = []
    ) {
      transfers: user_actions(
        where: {
          network: { _eq: "polygon_zk" }
          _not: { transaction_hash: { _in: $filterHashes } }
          token_short_name: { _in: $tokens }
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
        application
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
    transfers: UserTransaction[];
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
  application: string;
};

type BitqueryUserTransaction = {
  sender: {
    address: string;
  };
  receiver: { address: string };
  block: { timestamp: { unixtime: number } };
  transaction: { hash: string };
  amount: number;
  currency: { symbol: string };
};

type BitqueryUserTransactionRes = {
  data?: {
    [network: string]: {
      transfers: BitqueryUserTransaction[];
    };
  };
  errors?: unknown;
};

type HasuraUserTransaction = {
  sender_address: string;
  recipient_address: string;
  amount: number;
  token_decimals: number;
  token_short_name: string;
  transaction_hash: string;
  time: string;
  type: "swap" | "send";
  swap_in: boolean;
  application: string;
};

export type HasuraUserTransactionRes = {
  data?: { transfers: HasuraUserTransaction[] };
  errors?: unknown;
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
    tokens:
      network in ["ethereum"]
        ? tokens
        : // convert tokens to token_short_name
          tokens
            .map((addr) => getTokenFromAddress(network, addr))
            .filter((token): token is Token => !!token)
            .map(({ symbol }) => symbol.slice(1)),
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

  const result =
    networkGqlBackend(network) === "hasura"
      ? parseHasuraUserTransactions(
          await jsonPost<
            UserTransactionsByAddressBody,
            HasuraUserTransactionRes
          >(url, body, headers)
        )
      : parseBitqueryUserTransactions(
          await jsonPost<
            UserTransactionsByAddressBody,
            BitqueryUserTransactionRes
          >(url, body, headers),
          network
        );

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
    ...(networkGqlBackend(network) !== "hasura" && { tokens }),
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

  const result =
    networkGqlBackend(network) === "hasura"
      ? parseHasuraUserTransactions(
          await jsonPost<
            UserTransactionsByTxHashBody,
            HasuraUserTransactionRes
          >(url, body, headers)
        )
      : parseBitqueryUserTransactions(
          await jsonPost<
            UserTransactionsByTxHashBody,
            BitqueryUserTransactionRes
          >(url, body, headers),
          network
        );

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
    tokens:
      network in ["ethereum"]
        ? tokens
        : // convert tokens to token_short_name
          tokens
            .map((addr) => getTokenFromAddress(network, addr))
            .filter((token): token is Token => !!token)
            .map(({ symbol }) => symbol.slice(1)),
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

  const result =
    networkGqlBackend(network) === "hasura"
      ? parseHasuraUserTransactions(
          await jsonPost<UserTransactionsAllBody, HasuraUserTransactionRes>(
            url,
            body,
            headers
          )
        )
      : parseBitqueryUserTransactions(
          await jsonPost<UserTransactionsAllBody, BitqueryUserTransactionRes>(
            url,
            body,
            headers
          ),
          network
        );

  return result;
};

const parseHasuraUserTransactions = (
  result: HasuraUserTransactionRes
): UserTransactionsRes => {
  if (!result.data || result.errors)
    return {
      errors: result.errors,
    };

  const hasuraTransfers = result.data.transfers;

  return {
    data: {
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
          application: transfer.application,
        };
      }),
    },
  };
};

const parseBitqueryUserTransactions = (
  result: BitqueryUserTransactionRes,
  network: string
): UserTransactionsRes => {
  if (!result.data || result.errors)
    return {
      errors: result.errors,
    };

  const transfers: BitqueryUserTransaction[] =
    result.data[network]?.transfers ?? [];

  return {
    data: {
      transfers: transfers.map((transfer) => ({
        ...transfer,
        application: "none",
      })),
    },
  };
};

export {
  useUserTransactionsAll,
  useUserTransactionsByAddress,
  useUserTransactionsByTxHash,
};
