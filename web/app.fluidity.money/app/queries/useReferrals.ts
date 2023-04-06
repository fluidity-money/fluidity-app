import { gql, jsonPost } from "~/util";

const queryByAddress = gql`
  query getInactiveReferralByAddress($referrer: String!, $referee: String!) {
    lootbox_referrals(
      where: { referrer: { _eq: $address }, referee: { _eq: $referee } }
    ) {
      active
      created_time
      progress
      referee
      referrer
    }
  }
`;

const queryInactiveByAddress = gql`
  query getInactiveReferralByAddress($address: String!) {
    lootbox_referrals(
      where: { referrer: { _eq: $address }, active: { _eq: false } }
      order_by: { created_time: desc }
      limit: 1
    ) {
      active
      created_time
      progress
      referee
      referrer
    }
  }
`;

export type Referral = {
  active: boolean;
  created_time: string;
  progress: number;
  referee: string;
  referrer: string;
};

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
    query: queryByAddress,
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
    query: queryInactiveByAddress,
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
