import Moralis from "moralis";
import { gql, Queryable, getTokenForNetwork, jsonPost } from "~/util";
import { Chain, resolveMoralisChainName } from "~/util/chainUtils/chains";

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

const useUserTransactionByAddressCount = async (
  network: string,
  address: string,
  useMoralis = true
) => {
  const variables = {
    address: address,
    fluidCurrencies: getTokenForNetwork(network),
  };

  switch (true) {
    case network === "arbitrum":
    case network === "ethereum" && useMoralis: {
      const transfers = await Moralis.EvmApi.token.getWalletTokenTransfers({
        address,
        chain: resolveMoralisChainName(network as Chain),
      });
      return transfers.raw.total;
    }

    case network === "ethereum":
    case network === "solana": {
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

const useUserTransactionAllCount = async (
  network: string,
  useMoralis = true
) => {
  const variables = {
    fluidCurrencies: getTokenForNetwork(network),
  };

  switch (true) {
    case network === "arbitrum":
    case network === "ethereum" && useMoralis: {
      // fetch for each token and return the sum
      return await variables.fluidCurrencies.reduce(async (count, token) => {
        const {
          raw: { total },
        } = await Moralis.EvmApi.token.getTokenTransfers({
          address: token,
        });
        const transfers = total || 0;

        return (await count) + transfers;
      }, Promise.resolve(0));
    }

    case network === "ethereum":
    case network === "solana": {
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
