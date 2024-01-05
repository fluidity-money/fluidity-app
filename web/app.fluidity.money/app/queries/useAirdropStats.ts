import { Rarity } from "@fluidity-money/surfing";
import { BottleTiers } from "~/routes/$network/query/dashboard/airdrop";
import { jsonPost, gql, fetchInternalEndpoint } from "~/util";

const queryAirdropStatsByAddress = gql`
  query AirdropStats($epoch: lootbox_epoch!, $address: String!, $now: timestamp!) {
    lootboxCounts: lootbox_counts(
      args: { epoch_: $epoch }
      where: { address: { _eq: $address } }
    ) {
      ${Rarity.Common}: tier1
      ${Rarity.Uncommon}: tier2
      ${Rarity.Rare}: tier3
      ${Rarity.UltraRare}: tier4
      ${Rarity.Legendary}: tier5
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

export const useAirdropStatsByAddress = async (address: string, epoch: string) => {
  const { url, headers } = fetchInternalEndpoint();

  const variables = {
    address,
    epoch,
    now: new Date().toISOString(),
  };
  const body = {
    variables,
    query: queryAirdropStatsByAddress,
  };

  return await jsonPost<
    ExpectedAirdropStatsByAddressBody,
    ExpectedAirdropStatsByAddressResponse
  >(url, body, headers);
};

type ExpectedAirdropStatsByAddressBody = {
  variables: {
    address: string;
  };
  query: string;
};

type ExpectedAirdropStatsByAddressResponse = {
  data?: {
    lootboxCounts: BottleTiers[];
    liquidityMultiplier: [{ result: number }];
    referralsCount: { aggregate: { count: number } };
  };
  errors?: unknown;
};
