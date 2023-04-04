import { StakingEvent } from "~/routes/$network/query/airdrop";
import { gql, jsonPost } from "~/util";

const queryStakingDataByAddress = gql`
  query StakingData($network: network_blockchain!, $address: String!, $days_elapsed: Int!) {
    stakes: staking_events(
      where: {
        network: { _eq: $network }
        address: { _eq: $address }
      }
    ) {
      amount: usd_amount
      durationDays: lockup_length
      insertedDate: inserted_date
      // use a computed field
      multiplier: staking_liquidity_multiplier(
        {args: {$days_elapsed}}
      )
    }
  }
`;

export const useStakingDataByAddress = async (
  network: string,
  address: string
) => {
  const variables = { network, address };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: queryStakingDataByAddress,
  };

  return await jsonPost<
    ExpectedStakingDataByAddressBody,
    ExpectedStakingDataByAddressResponse
  >(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

type ExpectedStakingDataByAddressBody = {
  variables: {
    network: string;
    address: string;
  };
  query: string;
};

type ExpectedStakingDataByAddressResponse = {
  data?: {
    stakes: Array<StakingEvent>;
  };

  errors?: unknown;
};
