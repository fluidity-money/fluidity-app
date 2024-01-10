import { gql, jsonPost } from "~/util";

const queryVolume = gql`
  query VolumeStats($network: network_blockchain!) {
    day: total_volume(args: { network_: $network, interval_: "1 day" }) {
      actionCount: action_count
      totalVolume: total_volume
    }
    week: total_volume(args: { network_: $network, interval_: "1 week" }) {
      actionCount: action_count
      totalVolume: total_volume
    }
    month: total_volume(args: { network_: $network, interval_: "1 month" }) {
      actionCount: action_count
      totalVolume: total_volume
    }
    year: total_volume(args: { network_: $network, interval_: "1 year" }) {
      actionCount: action_count
      totalVolume: total_volume
    }
    all: total_volume(args: { network_: $network }) {
      actionCount: action_count
      totalVolume: total_volume
    }
  }
`;

const queryVolumeByAddress = gql`
  query VolumeStatsByAddress($network: network_blockchain!, $address: String!) {
    day: total_volume(
      args: { network_: $network, interval_: "1 day", address_: $address }
    ) {
      actionCount: action_count
      totalVolume: total_volume
    }
    week: total_volume(
      args: { network_: $network, interval_: "1 week", address_: $address }
    ) {
      actionCount: action_count
      totalVolume: total_volume
    }
    month: total_volume(
      args: { network_: $network, interval_: "1 month", address_: $address }
    ) {
      actionCount: action_count
      totalVolume: total_volume
    }
    year: total_volume(
      args: { network_: $network, interval_: "1 year", address_: $address }
    ) {
      actionCount: action_count
      totalVolume: total_volume
    }
    all: total_volume(args: { network_: $network, address_: $address }) {
      actionCount: action_count
      totalVolume: total_volume
    }
  }
`;

type VolumeStatsBody = {
  query: string;
  variables: {
    network: string;
  };
};

type VolumeStatsByAddressBody = {
  query: string;
  variables: {
    network: string;
    address: string;
  };
};

export type VolumeStatsResponse = {
  data?: {
    day: [
      {
        actionCount: number;
        totalVolume: number;
      }
    ];
    week: [
      {
        actionCount: number;
        totalVolume: number;
      }
    ];
    month: [
      {
        actionCount: number;
        totalVolume: number;
      }
    ];
    year: [
      {
        actionCount: number;
        totalVolume: number;
      }
    ];
    all: [
      {
        actionCount: number;
        totalVolume: number;
      }
    ];
  };
  errors?: unknown;
};

const useVolumeStatsByAddress = async (network: string, address: string) => {
  const variables = {
    network,
    address,
  };

  const body = {
    variables,
    query: queryVolumeByAddress,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return await jsonPost<VolumeStatsByAddressBody, VolumeStatsResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useVolumeStats = async (network: string) => {
  const variables = {
    network,
  };

  const body = {
    variables,
    query: queryVolume,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return await jsonPost<VolumeStatsBody, VolumeStatsResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { useVolumeStats, useVolumeStatsByAddress };
