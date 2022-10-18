import { gql, Queryable } from "~/util";

const query: Queryable = {
  ethereum: gql`
    query getPendingRewards($address: String!) {
      ethereum_pending_winners(
        where: { address: { _eq: $address } }
        order_by: { block_number: desc }
      ) {
        address
        reward_sent
        token_decimals
        token_short_name
        transaction_hash
        win_amount
      }
    }
  `,

  solana: gql``,
};

const useUserUnclaimedRewards = async (network: string, address: string) => {
  if (network !== "ethereum") {
    throw Error(`network ${network} not supported`);
  }

  const variables = {
    address,
  };

  return fetch("https://fluidity.hasura.app/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query[network],
      variables,
    }),
  });
};

export type UserUnclaimedReward = {
  address: string;
  reward_sent: boolean;
  token_decimals: number;
  token_short_name: string;
  transaction_hash: string;
  win_amount: number;
};

export default useUserUnclaimedRewards;
