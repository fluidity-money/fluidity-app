import { gql, jsonPost } from "~/util";

const queryAll = gql`
  query WinnersAll($network: network_blockchain!) {
    winners(
      where: { network: { _eq: $network } }
      distinct_on: transaction_hash
    ) {
      network
      solana_winning_owner_address
      winning_address
      transaction_hash
      winning_amount
      token_decimals
    }
  }
`;

const queryByAddress = gql`
  query WinnersAll($network: network_blockchain!, $address: String!) {
    winners(
      where: { network: { _eq: $network }, winning_address: { _eq: $address } }
      distinct_on: transaction_hash
    ) {
      network
      solana_winning_owner_address
      winning_address
      transaction_hash
      winning_amount
      token_decimals
    }
  }
`;

const useUserRewardsAll = async (network: string) => {
  const variables = { network };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryAll,
  };

  return jsonPost<ExpectedWinnersBody, ExpectedWinnersResponse>(url, body);
};

const useUserRewardsByAddress = async (network: string, address: string) => {
  const variables = { network, address };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryByAddress,
  };

  return jsonPost<ExpectedWinnersBody, ExpectedWinnersResponse>(url, body);
};

type ExpectedWinnersBody = {
  variables: {
    network: string;
  };
  query: string;
};

type ExpectedWinnersResponse = {
  data?: {
    winners: Array<Winner>;
  };

  errors?: unknown;
};

export type Winner = {
  network: string;
  solana_winning_owner_address: string | null;
  winning_address: string | null;
  transaction_hash: string;
  winning_amount: number;
  token_decimals: number;
};

export { useUserRewardsAll, useUserRewardsByAddress };
