import { gql, jsonPost } from "~/util";

const queryActiveByReferrerAddress = gql`
  query getClaimedReferrerReferralCount($address: String!) {
    lootbox_referrals_aggregate(
      where: { referrer: { _eq: $address }, active: { _eq: true } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const queryActiveByRefereeAddress = gql`
  query getClaimedReferrerReferralCount($address: String!) {
    lootbox_referrals_aggregate(
      where: { referrer: { _eq: $address }, active: { _eq: true } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const queryInactiveByRefereeAddress = gql`
  query getClaimedReferrerReferralCount($address: String!) {
    lootbox_referrals_aggregate(
      where: { referee: { _eq: $address }, active: { _eq: false } }
    ) {
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

const useActiveReferralCountByReferrerAddress = (address: string) => {
  const variables = {
    address,
  };

  const body = {
    query: queryActiveByReferrerAddress,
    variables,
  };

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    "https://39a0-2405-6e00-2088-240d-baee-48f7-8d86-a27.au.ngrok.io/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": "admin_secret",
        }
      : {}
  );
};

const useActiveReferralCountByRefereeAddress = (address: string) => {
  const variables = {
    address,
  };

  const body = {
    query: queryActiveByRefereeAddress,
    variables,
  };

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    "https://39a0-2405-6e00-2088-240d-baee-48f7-8d86-a27.au.ngrok.io/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": "admin_secret",
        }
      : {}
  );
};

const useInactiveReferralCountByRefereeAddress = (address: string) => {
  const variables = {
    address,
  };

  const body = {
    query: queryInactiveByRefereeAddress,
    variables,
  };

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    "https://39a0-2405-6e00-2088-240d-baee-48f7-8d86-a27.au.ngrok.io/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": "admin_secret",
        }
      : {}
  );
};

export {
  useActiveReferralCountByReferrerAddress,
  useActiveReferralCountByRefereeAddress,
  useInactiveReferralCountByRefereeAddress,
};
