import { gql, jsonPost } from "~/util";

const query = gql`
  query GraphData($network: network_blockchain!) {
    day: graph_bucket(
      args: { interval_: "1 hour", limit_: 24, network_: $network }
    ) {
      amount
      sender_address
      bucket
      time
    }
    week: graph_bucket(
      args: { interval_: "1 day", limit_: 7, network_: $network }
    ) {
      amount
      sender_address
      bucket
      time
    }
    month: graph_bucket(
      args: { interval_: "1 day", limit_: 30, network_: $network }
    ) {
      amount
      sender_address
      bucket
      time
    }
    year: graph_bucket(
      args: { interval_: "1 month", limit_: 12, network_: $network }
    ) {
      amount
      sender_address
      bucket
      time
    }
  }
`;

const useGraphData = async (network: string) => {
  const variables = { network };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: query,
  };

  return await jsonPost<GraphDataBody, GraphDataResponse>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export type GraphEntry = {
  amount: number;
  sender_address: string;
  // bucket for grouping by intervals of day, month etc
  bucket: string;
  // time for the exact timestamp of the highest event in each interval
  time: string;
};
export type GraphData = {
  day: GraphEntry[];
  week: GraphEntry[];
  month: GraphEntry[];
  year: GraphEntry[];
};

export type GraphDataResponse = {
  data?: GraphData;

  errors?: unknown;
};

type GraphDataBody = {
  variables: {
    network: string;
  };
  query: string;
};

export { useGraphData };
