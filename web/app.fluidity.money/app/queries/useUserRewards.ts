import { gql, jsonPost } from "~/util";

const queryWinnersAll = gql`
  query WinnersAll($network: network_blockchain!) {
    winners(
      where: {
        network: { _eq: $network }
        send_transaction_hash: { _neq: "" }
        transaction_hash: { _neq: "" }
      }
      order_by: { awarded_time: desc }
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
      awarded_time
      send_transaction_log_index
    }
  }
`;

const queryWinnersByAddress = gql`
  query WinnersByAddress($network: network_blockchain!, $address: String!) {
    winners(
      where: { network: { _eq: $network }, winning_address: { _eq: $address } }
      order_by: { awarded_time: desc }
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
      awarded_time
      send_transaction_log_index
    }
  }
`;

const queryPendingWinnersAll = gql`
  query PendingWinnersAll($network: network_blockchain!) {
    ethereum_pending_winners(
      where: {
        network: { _eq: $network }
        transaction_hash: { _neq: "" }
        reward_sent: { _eq: false }
      }
      order_by: { inserted_date: desc }
      limit: 240
    ) {
      network
      address
      inserted_date
      transaction_hash
      win_amount
      token_decimals
      reward_type
      log_index
    }
  }
`;

const queryPendingWinnersByAddress = gql`
  query PendingWinnersByAddress(
    $network: network_blockchain!
    $address: String!
  ) {
    ethereum_pending_winners(
      where: {
        network: { _eq: $network }
        address: { _eq: $address }
        reward_sent: { _eq: false }
      }
      order_by: { inserted_date: desc }
      limit: 240
    ) {
      network
      address
      inserted_date
      transaction_hash
      win_amount
      token_decimals
      reward_type
      log_index
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
    query: queryWinnersAll,
  };

  return jsonPost<ExpectedWinnersAllBody, ExpectedWinnersResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useUserRewardsByAddress = async (network: string, address: string) => {
  const variables = { network, address };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryWinnersByAddress,
  };

  return jsonPost<ExpectedWinnersByAddressBody, ExpectedWinnersResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useUserPendingRewardsAll = async (network: string) => {
  const variables = {
    network,
  };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryPendingWinnersAll,
  };

  return jsonPost<ExpectedWinnersAllBody, ExpectedPendingWinnersResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useUserPendingRewardsByAddress = async (
  network: string,
  address: string
) => {
  const variables = { network, address };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryPendingWinnersByAddress,
  };

  return jsonPost<ExpectedWinnersByAddressBody, ExpectedPendingWinnersResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
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

type ExpectedPendingWinnersResponse = {
  data?: {
    ethereum_pending_winners: Array<PendingWinner>;
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
  send_transaction_log_index: number;
  winning_amount: number;
  token_decimals: number;
  ethereum_application?: string;
  solana_application?: string;
  reward_type: "send" | "receive";
  awarded_time: string;
};

export type PendingWinner = {
  network: string;
  address: string | null;
  inserted_date: string;
  transaction_hash: string;
  token_decimals: number;
  win_amount: number;
  reward_type: "send" | "receive";
  log_index: number;
};

export {
  useUserRewardsAll,
  useUserRewardsByAddress,
  useUserPendingRewardsAll,
  useUserPendingRewardsByAddress,
};
