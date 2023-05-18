import { gql, jsonPost } from "~/util";
import config from "~/webapp.config.server";

export type Referral = {
  active: boolean;
  createdTime: string;
  progress: number;
  referee: string;
  referrer: string;
};

const QUERY_BY_ADDRESS = gql`
  query getInactiveReferralByAddress($referrer: String!, $referee: String!) {
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
      where: { referrer: { _eq: $address }, active: { _eq: false } }
      order_by: { created_time: desc }
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
    config.drivers.hasura[0].rpc.http,
    body,
    {
      "x-hasura-admin-secret": config.drivers.hasura[0].secret ?? "",
    }
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
    config.drivers.hasura[0].rpc.http,
    body,
    {
      "x-hasura-admin-secret": config.drivers.hasura[0].secret ?? "",
    }
  );
};

export { useReferralByAddress, useInactiveReferralByAddress };
