import { gql } from "~/util";
import config from "~/webapp.config";

const query = gql`
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
`;

const useUserTransactionCount = (address: string) => {
  const variables = {
    address: address,
    fluidCurrencies: config.ethereum.currencies,
  };
  return fetch("https://graphql.bitquery.io", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
};

export default useUserTransactionCount;
