import { gql, jsonPost } from "~/util";

const mutation = gql`
  mutation addReferral($address: String!, $referral_code: String!) {
    insert_lootbox_referral_codes_one(
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
    insert_lootbox_referral_codes_one: {
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
    "https://39a0-2405-6e00-2088-240d-baee-48f7-8d86-a27.au.ngrok.io/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
        "x-hasura-admin-secret": "admin_secret",
      }
      : {}
  );
};

export { addReferralCode };
