import { gql, Queryable, getTokenForNetwork, jsonPost } from "~/util";

const query: Queryable = {
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

const useUserTransactionCount = (network: string, address: string) => {
  const variables = {
    address: address,
    fluidCurrencies: getTokenForNetwork(network),
  };

  const body = {
    query: query[network],
    variables,
  };

  return jsonPost("https://graphql.bitquery.io", body, {
    "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
  });
};

export default useUserTransactionCount;
