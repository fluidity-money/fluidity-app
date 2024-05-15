import { gql, jsonPost } from "~/util";

const queryByAddress = gql`
  query getReferralCodeByAddress($address: String!, $epoch: lootbox_epoch!) {
    lootbox_referral_codes(
      where: { address: { _eq: $address }, epoch: { _eq: $epoch } }
    ) {
      address
      referral_code
      epoch
    }
  }
`;

const queryByCode = gql`
  query getReferralCodeByCode($code: String!, $epoch: lootbox_epoch!) {
    lootbox_referral_codes(
      where: { referral_code: { _eq: $code }, epoch: { _eq: $epoch } }
    ) {
      address
      referral_code
      epoch
    }
  }
`;

type ReferralCodeByAddressBody = {
  query: string;
  variables: {
    address: string;
    epoch: string;
  };
};

type ReferralCodeByCodeBody = {
  query: string;
  variables: {
    code: string;
    epoch: string;
  };
};

export type ReferralCode = {
  address: string;
  referral_code: string;
  epoch: string;
};

type ReferralCodeRes = {
  data?: {
    lootbox_referral_codes: Array<ReferralCode>;
  };
  errors?: unknown;
};

const useReferralCodeByAddress = (address: string, epoch: string) => {
  const variables = {
    address,
    epoch,
  };

  const body = {
    query: queryByAddress,
    variables,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<ReferralCodeByAddressBody, ReferralCodeRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useReferralCodeByCode = (code: string, epoch: string) => {
  const variables = {
    code,
    epoch,
  };

  const body = {
    query: queryByCode,
    variables,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<ReferralCodeByCodeBody, ReferralCodeRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { useReferralCodeByAddress, useReferralCodeByCode };
