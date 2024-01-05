import { gql, jsonPost } from "~/util";

const queryStakingDataByAddress = gql`
  query StakingData($address: String!, $days_elapsed: Int!) {
    stakes: staking_events(where: { address: { _eq: $address } }) {
      amount: usd_amount
      durationSecs: lockup_length
      insertedDate: inserted_date
      # use a computed field
      multiplier: staking_liquidity_multiplier(
        args: { days_elapsed: $days_elapsed }
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
  const variables = {
    address: `0x${"0".repeat(24)}${address.slice(2)}`,
    days_elapsed: daysElapsed,
  };
  const url = process.env.FLU_HASURA_URL!;
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

type RawStakingEvent = {
  amount: number;
  durationSecs: number;
  multiplier: Array<{ result: number }>;
  insertedDate: string;
};

type ExpectedStakingDataByAddressResponse = {
  data?: {
    stakes: Array<RawStakingEvent>;
  };

  errors?: unknown;
};
