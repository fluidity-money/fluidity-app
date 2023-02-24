import { gql, jsonPost } from "~/util";

const queryByAddress = gql`
  query getReferralCount($address: String!) {
    lootbox_referrals(where: { address_1: { _eq: $address } }) {
      aggregate {
        count
      }
    }
  }
`;

type ReferralCountByAddressBody = {
  query: string;
  variables: {
    address: string;
  };
};

type ReferralCountRes = {
  data?: {
    lootbox_referrals: {
      aggregate: {
        count: number;
      };
    };
  };
  errors?: unknown;
};

const useReferralCountByAddress = (address: string) => {
  const variables = {
    address,
  };

  const body = {
    query: queryByAddress,
    variables,
  };

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    "https://fluidity.hasura.app/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { useReferralCountByAddress };
