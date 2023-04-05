import { gql, jsonPost } from "~/util";

const queryByAddress = gql`
  query getReferralCodeByAddress($address: String!) {
    lootbox_referral_codes(where: { address: { _eq: $address } }) {
      address
      referral_code
    }
  }
`;

const queryByCode = gql`
  query getReferralCodeByCode($code: String!) {
    lootbox_referral_codes(where: { referral_code: { _eq: $code } }) {
      address
      referral_code
    }
  }
`;

type ReferralCodeByAddressBody = {
  query: string;
  variables: {
    address: string;
  };
};

type ReferralCodeByCodeBody = {
  query: string;
  variables: {
    code: string;
  };
};

export type ReferralCode = {
  address: string;
  referral_code: string;
};

type ReferralCodeRes = {
  data?: {
    lootbox_referral_codes: Array<ReferralCode>;
  };
  errors?: unknown;
};

const useReferralCodeByAddress = (address: string) => {
  const variables = {
    address,
  };

  const body = {
    query: queryByAddress,
    variables,
  };

  return jsonPost<ReferralCodeByAddressBody, ReferralCodeRes>(
    "https://39a0-2405-6e00-2088-240d-baee-48f7-8d86-a27.au.ngrok.io/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
        "x-hasura-admin-secret": "admin_secret",
      }
      : {}
  );
};

const useReferralCodeByCode = (code: string) => {
  const variables = {
    code,
  };

  const body = {
    query: queryByCode,
    variables,
  };

  return jsonPost<ReferralCodeByCodeBody, ReferralCodeRes>(
    "https://39a0-2405-6e00-2088-240d-baee-48f7-8d86-a27.au.ngrok.io/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
        "x-hasura-admin-secret": "admin_secret",
      }
      : {}
  );
};

export { useReferralCodeByAddress, useReferralCodeByCode };
