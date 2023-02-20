import { gql, jsonPost } from "~/util";

const tokenQuery = gql`query UseTokens {
  asset {
    is_fluid
    contract_address
    symbol
    name
    logo
    decimals
  }
}`;

export type Asset = {
    is_fluid: boolean;
    contract_address: string;
    symbol: string;
    name: string;
    logo: string;
    decimals: number;
};

export const useTokens = async () => {
    const { 
        data: {
            asset
        }
    } = await jsonPost(
        "https://fluidity.hasura.app/v1/graphql",
        tokenQuery,
        process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {});
    return asset as Asset[];
}