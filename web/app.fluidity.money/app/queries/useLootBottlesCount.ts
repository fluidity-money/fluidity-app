import { Rarity } from "@fluidity-money/surfing";
import { BottleTiers } from "~/routes/$network/query/dashboard/airdrop";
import { jsonPost, gql, fetchInternalEndpoint } from "~/util";

const QUERY_REFERRALS_BY_ADDRESS = gql`
  query getReferralLootboxCountByAddress($address: String!) {
    referralLootboxCounts: lootbox_referral_lootbottle_counts(where: { address: { _eq: $address } }) {
      ${Rarity.Common}: tier1
      ${Rarity.Uncommon}: tier2
      ${Rarity.Rare}: tier3
      ${Rarity.UltraRare}: tier4 
      ${Rarity.Legendary}: tier5
    }
  }
`;

type ReferralLootboxCountBody = {
  query: string;
  variables: {
    address: string;
  };
};

type ReferralLootboxCountRes = {
  data?: {
    referralLootboxCounts: BottleTiers[];
  };
  errors?: unknown;
};

const useReferralLootboxesByAddress = (address: string) => {
  const { url, headers } = fetchInternalEndpoint();

  const variables = {
    address,
  };

  const body = {
    query: QUERY_REFERRALS_BY_ADDRESS,
    variables,
  };

  return jsonPost<ReferralLootboxCountBody, ReferralLootboxCountRes>(
    url,
    body,
    headers
  );
};

export { useReferralLootboxesByAddress };
