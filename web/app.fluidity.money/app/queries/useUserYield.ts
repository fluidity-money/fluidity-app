import { gql, jsonPost } from "~/util";
import { Chain } from "~/util/chainUtils/chains";

const queryAll = gql`
  fragment rewardFields on total_reward_return {
    network
    total_reward
    count
  }
  query TotalRewards($network: network_blockchain!) {
    week: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 week" }
    ) {
      ...rewardFields
    }
    month: rewardFields(
      where: { network: { _eq: $network } }
      args: { i: "1 month" }
    ) {
      ...rewardFields
    }
    year: rewardFields(
      where: { network: { _eq: $network } }
      args: { i: "1 year" }
    ) {
      ...rewardFields
    }
    all: rewardFields(where: { network: { _eq: $network } }, args: {}) {
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
    week: total_reward(
      where: { network: { _eq: $network } }
      args: { i: "1 week", address: $address }
    ) {
      ...rewardFields
    }
    month: rewardFields(
      where: { network: { _eq: $network } }
      args: { i: "1 month", address: $address }
    ) {
      ...rewardFields
    }
    year: rewardFields(
      where: { network: { _eq: $network } }
      args: { i: "1 year", address: $address }
    ) {
      ...rewardFields
    }
    all: rewardFields(
      where: { network: { _eq: $network } }
      args: { address: $address }
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
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryAll,
  };

  return jsonPost<UserYieldAllBody, UserYieldResponse>(url, body);
};

const useUserYieldByAddress = async (network: string, address: string) => {
  const variables = { network, address };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryByAddress,
  };

  return jsonPost<UserYieldByAddressBody, UserYieldResponse>(url, body);
};

export type UserYield = {
  network: Chain;
  total_reward: number;
  count: number;
};

export type UserYieldResponse = {
  data?: {
    week: Array<UserYield>;
    month: Array<UserYield>;
    year: Array<UserYield>;
    all: Array<UserYield>;
  };

  errors?: unknown;
};

export { useUserYieldAll, useUserYieldByAddress };
