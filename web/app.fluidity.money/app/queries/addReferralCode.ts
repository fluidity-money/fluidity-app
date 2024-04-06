import { gql, jsonPost } from "~/util";

const mutation = gql`
  mutation addReferral($address: String!, $referral_code: String!, $epoch: lootbox_epoch!) {
    insert_lootbox_referral_codes_one(
      object: { address: $address, referral_code: $referral_code, epoch: $epoch}
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
    epoch: string;
  };
};

type AddReferralCodeRes = {
  data?: {
    insert_lootbox_referral_codes_one: {
      address: string;
      referral_code: string;
      epoch: string;
    };
  };
  errors?: unknown;
};

const addReferralCode = (address: string, code: string, epoch: string) => {
  const variables = {
    address,
    referral_code: code,
    epoch,
  };

  const body = {
    query: mutation,
    variables,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<AddReferralCodeBody, AddReferralCodeRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { addReferralCode };
