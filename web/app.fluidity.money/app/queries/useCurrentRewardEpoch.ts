import { gql, jsonPost } from "~/util";

const QUERY = gql`
  query getCurrentRewardEpoch() {
    reward_epochs(
      order_by: { start: desc }
      limit: 1
    ) {
      id
      start
      end
      application
    }
  }
`;

export type RewardEpoch = {
  id: number;
  start: string;
  end: string;
  application?: string;
};

type RewardEpochRes = {
  data?: {
    reward_epochs: Array<RewardEpoch>;
  };
  errors?: unknown;
};

type CurrentRewardEpochBody = {};

const useCurrentRewardEpoch = () => {
  const variables = {};

  const body = {
    query: QUERY,
    variables,
  };

  return jsonPost<CurrentRewardEpochBody, RewardEpochRes>(
    "https://fluidity.hasura.app/v1/graphql",
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export { useCurrentRewardEpoch };
