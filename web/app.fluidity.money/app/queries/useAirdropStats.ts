import { BottleCounts } from "~/routes/$network/query/airdrop";
import { jsonPost, gql } from "~/util";

const queryAirdropStatsByAddress = gql`
  query AirdropStats($address: String!, $now: timestamp!) {
    lootboxCounts: lootbox_counts(where: { address: { _eq: $address } }) {
      address
      tier1
      tier2
      tier3
      tier4
      tier5
    }
    liquidityMultiplier: calculate_a_y(
      args: { address_: $address, instant: $now }
    ) {
      result
    }
    referralsCount: lootbox_referrals_aggregate(
      where: { referrer: { _eq: $address } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const useAirdropStatsByAddress = async (address: string) => {
  const variables = { address, now: new Date().toISOString() };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryAirdropStatsByAddress,
  };

  return await jsonPost<
    ExpectedAirdropStatsByAddressBody,
    ExpectedAirdropStatsByAddressResponse
  >(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

type ExpectedAirdropStatsByAddressBody = {
  variables: {
    address: string;
  };
  query: string;
};

type ExpectedAirdropStatsByAddressResponse = {
  data?: {
    lootboxCounts: [BottleCounts];
    liquidityMultiplier: [{ result: number | null }];
    referralsCount: { aggregate: { count: number } };
  };
  errors?: unknown;
};
