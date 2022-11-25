import { gql, Queryable, jsonPost } from "~/util";

const query: Queryable = {
  ethereum: gql`
    query getPendingRewards($address: String!) {
      ethereum_pending_winners(
        where: { reward_sent: { _eq: false }, address: { _eq: $address } }
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

type UnclaimedRewardsReq = {
  query: string;
  variables: {
    address: string;
  };
};

type UnclaimedRewardsRes = {
  data?: {
    ethereum_pending_winners: {
      address: string;
      reward_sent: boolean;
      token_decimals: number;
      
      token_short_name: string;
      transaction_hash: string;
      win_amount: number;
      block_number: number;
    }[];
  };
  error?: string;
};

const useUserUnclaimedRewards = async (network: string, address: string) => {
  if (network !== "ethereum") {
    throw Error(`network ${network} not supported`);
  }

  const body = {
    query: query[network],
    variables: {
      address: address.toLowerCase(),
    },
  };

  const fluGqlEndpoint = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<UnclaimedRewardsReq, UnclaimedRewardsRes>(
    fluGqlEndpoint,
    body
  );
};

export type UserUnclaimedReward = {
  address: string;
  reward_sent: boolean;
  token_decimals: number;
  token_short_name: string;
  transaction_hash: string;
  win_amount: number;
  block_number: number;
};

export default useUserUnclaimedRewards;
