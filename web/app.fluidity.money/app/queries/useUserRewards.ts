import { gql, jsonPost } from "~/util";

const queryAll = gql`
  query WinnersAll($network: network_blockchain!) {
    winners(
      where: {
        network: { _eq: $network }
        send_transaction_hash: { _neq: "" }
        transaction_hash: { _neq: "" }
      }
      order_by: { created: desc }
      limit: 240
    ) {
      network
      solana_winning_owner_address
      winning_address
      created
      transaction_hash
      send_transaction_hash
      winning_amount
      token_decimals
      ethereum_application
      solana_application
      reward_type
    }
  }
`;

const queryByAddress = gql`
  query WinnersByAddress($network: network_blockchain!, $address: String!) {
    winners(
      where: { network: { _eq: $network }, winning_address: { _eq: $address } }
      order_by: { created: desc }
      limit: 240
    ) {
      network
      solana_winning_owner_address
      winning_address
      created
      transaction_hash
      send_transaction_hash
      winning_amount
      token_decimals
      ethereum_application
      solana_application
      reward_type
    }
  }
`;

const useUserRewardsAll = async (network: string) => {
  const variables = {
    network,
  };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryAll,
  };

  return jsonPost<ExpectedWinnersAllBody, ExpectedWinnersResponse>(url, body, process.env.HASURA_TOKEN ? {
    "x-hasura-admin-secret": process.env.HASURA_TOKEN ?? "",
    
  } : {} );
};

const useUserRewardsByAddress = async (network: string, address: string) => {
  const variables = { network, address };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryByAddress,
  };

  return jsonPost<ExpectedWinnersByAddressBody, ExpectedWinnersResponse>(
    url,
    body, process.env.HASURA_TOKEN ? {
    "x-hasura-admin-secret": process.env.HASURA_TOKEN ?? "",
    
  } : {} 
  );
};

type ExpectedWinnersAllBody = {
  variables: {
    network: string;
  };
  query: string;
};

type ExpectedWinnersByAddressBody = {
  variables: {
    network: string;
    address: string;
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
  created: string;
  transaction_hash: string;
  send_transaction_hash: string;
  winning_amount: number;
  token_decimals: number;
  ethereum_application?: string;
  solana_application?: string;
  reward_type: "send" | "receive";
};

export { useUserRewardsAll, useUserRewardsByAddress };
