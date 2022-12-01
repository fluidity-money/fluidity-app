import { gql, jsonPost } from "~/util"

const query = gql`
query VolumeCalculation($token: String!) {
  ethereum {
    transfers(
      currency: {
        is: $token
      }
    ) {
      amount
    }
  }
}`;

type VolumeCalculationBody = {
    query: string;
    variables: {
      token: string;
    };
};

export type VolumeCalculationResponse = {
    data: {
        ethereum: {
            transfers: [{
                amount: string;
            }]
        }
    }
}

export const useVolumeCalculation = async (token: string) => {
    const variables = { token };
    const url = "https://graphql.bitquery.io";
    const body = {
        variables,
        query,
    };
    
    return jsonPost<VolumeCalculationBody, VolumeCalculationResponse>(url, body,
    {
      "X-API-KEY": process.env.BITQUERY_TOKEN ?? "",
    }
  );
}