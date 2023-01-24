import Moralis from "moralis";
import { gql, Queryable, getTokenForNetwork, jsonPost } from "~/util";
import {
  Chain,
  chainType,
  resolveMoralisChainName,
} from "~/util/chainUtils/chains";

const queryByAddress: Queryable = {
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

const useUserTransactionByAddressCount = async (
  network: string,
  address: string
) => {
  const variables = {
    address: address,
    fluidCurrencies: getTokenForNetwork(network),
  };

  switch (chainType(network)) {
    case "evm": {
      try {
        console.log(
          "[Call] Moralis.EvmApi.token.getWalletTokenTransfers for address: ",
          address,
          " on network: ",
          network
        );
      const transfers = await Moralis.EvmApi.token.getWalletTokenTransfers({
        address,
        chain: resolveMoralisChainName(network as Chain),
      });
      return transfers.raw.total;
      } catch (e) {
        console.error(e);
        return {
          errors:
            "Error fetching transactions: This is an upstream issue and we're working with the Moralis team to resolve it. Sit tight!",
        };
      }
    }

    case "solana": {
      const body = {
        query: queryByAddress[network],
        variables,
      };

      return jsonPost<
        UserTransactionCountByAddressBody,
        UserTransactionCountRes
      >("https://graphql.bitquery.io", body, {
        "X-API-KEY": process.env.FLU_BITQUERY_TOKEN ?? "",
      });
    }

    default:
      return {
        errors: `Unsupported network ${network}`,
      };
  }
};

const useUserTransactionAllCount = async (network: string) => {
  const variables = {
    fluidCurrencies: getTokenForNetwork(network),
  };

  switch (chainType(network)) {
    case "evm":
      // fetch for each token and return the sum
      try {
      return await variables.fluidCurrencies.reduce(async (count, token) => {
        console.log(
          "[Call] Moralis.EvmApi.token.getTokenTransfers for address: ",
          token,
          " on network: ",
          network
        );
        const {
          raw: { total },
        } = await Moralis.EvmApi.token.getTokenTransfers({
          address: token,
        });
        const transfers = total || 0;

        return (await count) + transfers;
      }, Promise.resolve(0));
      } catch (e) {
        console.error(e);
        return {
          errors:
            "Error fetching transactions: This is an upstream issue and we're working with the Moralis team to resolve it. Sit tight!",
        };
      }

    case "solana": {
      const body = {
        query: queryAll[network],
        variables,
      };

      return jsonPost<UserTransactionCountAllBody, UserTransactionCountRes>(
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

export { useUserTransactionAllCount, useUserTransactionByAddressCount };
