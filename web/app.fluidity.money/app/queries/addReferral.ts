import { gql, jsonPost } from "~/util";

const mutation = gql`
  mutation addReferral($referrer: String!, $referee: String!) {
    insert_lootbox_referrals_one(
      object: { referrer: $referrer, referee: $referee }
    ) {
      referrer
      referee
    }
  }
`;

type AddReferralBody = {
  query: string;
  variables: {
    referrer: string;
    referee: string;
  };
};

type AddReferralRes = {
  data?: {
    lootbox_referrals: {
      referrer: string;
      referee: string;
    };
  };
  errors?: unknown;
};

const addReferral = (referrer: string, referee: string) => {
  const variables = {
    referrer,
    referee,
  };

  const body = {
    query: mutation,
    variables,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<AddReferralBody, AddReferralRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { addReferral };
