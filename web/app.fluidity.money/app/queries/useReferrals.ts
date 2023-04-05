import { gql, jsonPost } from "~/util";

const queryByAddress = gql`
  query getReferralCount($address: String!) {
    lootbox_referrals_aggregate(where: { referrer: { _eq: $address } }) {
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
    lootbox_referrals_aggregate: {
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
    "https://3ec4-2405-6e00-492-6208-4899-8879-7546-8995.au.ngrok.io/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
        "x-hasura-admin-secret": "admin_secret",
      }
      : {}
  );
};

export { useReferralCountByAddress };
