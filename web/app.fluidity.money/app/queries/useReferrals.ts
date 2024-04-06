import { gql, jsonPost } from "~/util";

export type Referral = {
  active: boolean;
  createdTime: string;
  progress: number;
  referee: string;
  referrer: string;
  epoch: string;
};

const QUERY_BY_ADDRESS = gql`
  query getReferralByAddress($referrer: String!, $referee: String!, $epoch: lootbox_epoch!) {
    lootbox_referrals(
      where: { referrer: { _eq: $referrer }, referee: { _eq: $referee }, epoch: { _eq: $epoch } }
    ) {
      active
      createdTime: created_time
      progress
      referee
      referrer
      epoch
    }
  }
`;

const QUERY_INACTIVE_BY_ADDRESS = gql`
  query getInactiveReferralByAddress($address: String!, $epoch: lootbox_epoch!) {
    lootbox_referrals(
      where: { referee: { _eq: $address }, active: { _eq: false }, epoch: { _eq: $epoch } }
      order_by: { created_time: asc }
      limit: 1
    ) {
      active
      createdTime: created_time
      progress
      referee
      referrer
      epoch
    }
  }
`;

type ReferralsByAddressBody = {
  query: string;
  variables: {
    referrer: string;
    referee: string;
    epoch: string;
  };
};

type InactiveReferralsByAddressBody = {
  query: string;
  variables: {
    address: string;
    epoch: string;
  };
};

type ReferralsRes = {
  data?: {
    lootbox_referrals: Array<Referral>;
  };
  errors?: unknown;
};

const useReferralByAddress = (referrer: string, referee: string, epoch: string) => {
  const variables = {
    referrer,
    referee,
    epoch,
  };

  const body = {
    query: QUERY_BY_ADDRESS,
    variables,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<ReferralsByAddressBody, ReferralsRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useInactiveReferralByAddress = (address: string, epoch: string) => {
  const variables = {
    address,
    epoch,
  };

  const body = {
    query: QUERY_INACTIVE_BY_ADDRESS,
    variables,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<InactiveReferralsByAddressBody, ReferralsRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { useReferralByAddress, useInactiveReferralByAddress };
