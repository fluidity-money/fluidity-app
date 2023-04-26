import { StakingEvent } from "~/routes/$network/query/airdrop";
import { gql, jsonPost } from "~/util";

const queryStakingDataByAddress = gql`
  query StakingData($address: String!, $days_elapsed: Int!) {
    stakes: staking_events(
      where: {
        address: { _eq: $address }
      }
    ) {
      amount: usd_amount
      durationDays: lockup_length
      insertedDate: inserted_date
      # use a computed field
      multiplier: staking_liquidity_multiplier(
        args: {days_elapsed: $days_elapsed}
      ) {
        result
      }
    }
  }
`;

export const useStakingDataByAddress = async (
  address: string,
  daysElapsed: number
) => {
  const variables = { address, days_elapsed: daysElapsed };
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
    address: string;
    days_elapsed: number;
  };
  query: string;
};

type ExpectedStakingDataByAddressResponse = {
  data?: {
    stakes: Array<StakingEvent>;
  };

  errors?: unknown;
};
