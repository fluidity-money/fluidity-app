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
  query getClaimedReferreeReferralCount($address: String!) {
    lootbox_referrals_aggregate(
      where: { referee: { _eq: $address }, active: { _eq: true } }
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

  const url = process.env.FLU_HASURA_URL;

  if (!url) throw new Error("FLU_HASURA_URL not set!");

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
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

  const url = process.env.FLU_HASURA_URL;

  if (!url) throw new Error("FLU_HASURA_URL not set!");

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
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

  const url = process.env.FLU_HASURA_URL;

  if (!url) throw new Error("FLU_HASURA_URL not set!");

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export {
  useActiveReferralCountByReferrerAddress,
  useActiveReferralCountByRefereeAddress,
  useInactiveReferralCountByRefereeAddress,
};
