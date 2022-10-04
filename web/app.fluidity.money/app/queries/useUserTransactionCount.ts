import { gql, Queryable, getTokenForNetwork } from "~/util";

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
  return fetch("https://graphql.bitquery.io", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query[network],
      variables,
    }),
  });
};

export default useUserTransactionCount;
