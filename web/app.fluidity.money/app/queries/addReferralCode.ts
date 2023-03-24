import { gql, jsonPost } from "~/util";

const mutation = gql`
  mutation addReferral($address: String!, $referral_code: String!) {
    insert_lootbox_referrals_codes(
      object: { address: $address, referral_code: $referral_code }
    ) {
      address
      referral_code
    }
  }
`;

type AddReferralCodeBody = {
  query: string;
  variables: {
    address: string;
    referral_code: string;
  };
};

type AddReferralCodeRes = {
  data?: {
    lootbox_code: {
      address: string;
      referral_code: string;
    };
  };
  errors?: unknown;
};

const addReferralCode = (address: string, code: string) => {
  const variables = {
    address,
    referral_code: code,
  };

  const body = {
    query: mutation,
    variables,
  };

  return jsonPost<AddReferralCodeBody, AddReferralCodeRes>(
    "https://fluidity.hasura.app/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
        "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
      }
      : {}
  );
};

export { addReferralCode };
