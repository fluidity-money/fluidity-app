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
    "https://fluidity.hasura.app/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
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
    "https://fluidity.hasura.app/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { useReferralCodeByAddress, useReferralCodeByCode };
