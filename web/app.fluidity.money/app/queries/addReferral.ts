import { gql, jsonPost } from "~/util";

const mutation = gql`
  mutation addReferral($address1: String!, $address2: String!) {
    insert_lootbox_referrals_one(
      object: { address1: $address1, address2: $address2 }
    ) {
      address1
      address2
    }
  }
`;

type AddReferralBody = {
  query: string;
  variables: {
    address1: string;
    address2: string;
  };
};

type AddReferralRes = {
  data?: {
    lootbox_referrals: {
      address1: string;
      address2: string;
    };
  };
  errors?: unknown;
};

const addReferral = (address1: string, address2: string) => {
  const variables = {
    address1,
    address2,
  };

  const body = {
    query: mutation,
    variables,
  };

  return jsonPost<AddReferralBody, AddReferralRes>(
    "https://fluidity.hasura.app/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { addReferral };
