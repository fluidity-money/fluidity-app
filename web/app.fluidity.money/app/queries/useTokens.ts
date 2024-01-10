import { gql, jsonPost } from "~/util";

const tokenQuery = gql`
  query UseTokens {
    asset {
      is_fluid
      contract_address
      symbol
      name
      logo
      decimals
    }
  }
`;

export type Asset = {
  is_fluid: boolean;
  contract_address: string;
  symbol: string;
  name: string;
  logo: string;
  decimals: number;
};

export const useTokens = async () => {
  const url = process.env.FLU_HASURA_URL;

  if (!url) throw new Error("FLU_HASURA_URL not set!");

  const {
    data: { asset },
  } = await jsonPost(
    url,
    { query: tokenQuery },
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
  return asset || ([] as Asset[]);
};
