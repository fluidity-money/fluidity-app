import { gql, jsonPost } from "~/util";
import { Chain } from "~/util/chainUtils/chains";

const queryAll = gql`
  fragment rewardFields on total_reward_return {
    network
    total_reward
    count
  }
  query TotalRewards($network: network_blockchain!) {
    day: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 day" }
    ) {
      ...rewardFields
    }
    week: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 week" }
    ) {
      ...rewardFields
    }
    month: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 month" }
    ) {
      ...rewardFields
    }
    year: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 year" }
    ) {
      ...rewardFields
    }
    all: total_reward(where: { network: { _eq: $network } }, args: {}) {
      ...rewardFields
    }
  }
`;

type UserYieldAllBody = {
  variables: {
    network: string;
  };
  query: string;
};

const queryByAddress = gql`
  fragment rewardFields on total_reward_return {
    network
    total_reward
    count
  }
  query TotalRewards($network: network_blockchain!, $address: String!) {
    day: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 day", filter_address: $address }
    ) {
      ...rewardFields
    }
    week: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 week", filter_address: $address }
    ) {
      ...rewardFields
    }
    month: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 month", filter_address: $address }
    ) {
      ...rewardFields
    }
    year: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 year", filter_address: $address }
    ) {
      ...rewardFields
    }
    all: total_reward(
      where: { network: { _eq: $network } }
      args: { filter_address: $address }
    ) {
      ...rewardFields
    }
  }
`;

type UserYieldByAddressBody = {
  variables: {
    network: string;
    address: string;
  };
  query: string;
};

const useUserYieldAll = async (network: string) => {
  const variables = { network };
  const url = process.env.FLU_HASURA_URL!;
  const body = {
    variables,
    query: queryAll,
  };

  return jsonPost<UserYieldAllBody, UserYieldResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useUserYieldByAddress = async (network: string, address: string) => {
  const variables = { network, address };
  const url = process.env.FLU_HASURA_URL!;
  const body = {
    variables,
    query: queryByAddress,
  };

  return jsonPost<UserYieldByAddressBody, UserYieldResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export type UserYield = {
  network: Chain;
  total_reward: number;
  count: number;
};

export type TimeSepUserYield = {
  day: UserYield[];
  week: UserYield[];
  month: UserYield[];
  year: UserYield[];
  all: UserYield[];
};

export type UserYieldResponse = {
  data?: TimeSepUserYield;

  errors?: unknown;
};

export { useUserYieldAll, useUserYieldByAddress };
