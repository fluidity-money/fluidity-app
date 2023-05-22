import { gql, jsonPost } from "~/util";

export type Referral = {
  active: boolean;
  createdTime: string;
  progress: number;
  referee: string;
  referrer: string;
};

const QUERY_BY_ADDRESS = gql`
  query getReferralByAddress($referrer: String!, $referee: String!) {
    lootbox_referrals(
      where: { referrer: { _eq: $referrer }, referee: { _eq: $referee } }
    ) {
      active
      createdTime: created_time
      progress
      referee
      referrer
    }
  }
`;

const QUERY_INACTIVE_BY_ADDRESS = gql`
  query getInactiveReferralByAddress($address: String!) {
    lootbox_referrals(
      where: { referee: { _eq: $address }, active: { _eq: false } }
      order_by: { created_time: asc }
      limit: 1
    ) {
      active
      createdTime: created_time
      progress
      referee
      referrer
    }
  }
`;

type ReferralsByAddressBody = {
  query: string;
  variables: {
    referrer: string;
    referee: string;
  };
};

type InactiveReferralsByAddressBody = {
  query: string;
  variables: {
    address: string;
  };
};

type ReferralsRes = {
  data?: {
    lootbox_referrals: Array<Referral>;
  };
  errors?: unknown;
};

const useReferralByAddress = (referrer: string, referee: string) => {
  const variables = {
    referrer,
    referee,
  };

  const body = {
    query: QUERY_BY_ADDRESS,
    variables,
  };

  return jsonPost<ReferralsByAddressBody, ReferralsRes>(
    "https://fluidity.hasura.app/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useInactiveReferralByAddress = (address: string) => {
  const variables = {
    address,
  };

  const body = {
    query: QUERY_INACTIVE_BY_ADDRESS,
    variables,
  };

  return jsonPost<InactiveReferralsByAddressBody, ReferralsRes>(
    "https://fluidity.hasura.app/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { useReferralByAddress, useInactiveReferralByAddress };
