import { gql, Queryable, jsonPost } from "~/util";
import { chainType } from "~/util/chainUtils/chains";

const query: Queryable = {
  solana: gql``,

  arbitrum: gql`
    query getPendingRewards($address: String!) {
      ethereum_pending_winners(
        where: {
          reward_sent: { _eq: false }
          address: { _eq: $address }
          network: { _eq: "arbitrum" }
        }
        order_by: { block_number: desc }
      ) {
        address
        reward_sent
        token_decimals
        token_short_name
        transaction_hash
        win_amount
        block_number
      }
    }
  `,

  polygon_zk: gql`
    query getPendingRewards($address: String!) {
      ethereum_pending_winners(
        where: {
          reward_sent: { _eq: false }
          address: { _eq: $address }
          network: { _eq: "polygon_zk" }
        }
        order_by: { block_number: desc }
      ) {
        address
        reward_sent
        token_decimals
        token_short_name
        transaction_hash
        win_amount
        block_number
      }
    }
  `,
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
  if (chainType(network) !== "evm") {
    throw Error(`network ${network} not supported`);
  }

  const body = {
    query: query[network],
    variables: {
      address: address.toLowerCase(),
    },
  };

  const url = process.env.FLU_HASURA_URL;

  if (!url) throw new Error("FLU_HASURA_URL not set!");

  return jsonPost<UnclaimedRewardsReq, UnclaimedRewardsRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
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
