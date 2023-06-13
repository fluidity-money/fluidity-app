import { gql, jsonPost } from "~/util";
import { fetchInternalEndpoint } from "~/util";

const QUERY_ALL = gql`
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

const QUERY_BY_USER = gql`
  query GraphDataByAddress($network: network_blockchain!, $address: String!) {
    day: graph_bucket(
      args: {
        interval_: "1 hour"
        limit_: 24
        network_: $network
        address: $address
      }
    ) {
      amount
      sender_address
      bucket
      time
    }
    week: graph_bucket(
      args: {
        interval_: "1 day"
        limit_: 7
        network_: $network
        address: $address
      }
    ) {
      amount
      sender_address
      bucket
      time
    }
    month: graph_bucket(
      args: {
        interval_: "1 day"
        limit_: 30
        network_: $network
        address: $address
      }
    ) {
      amount
      sender_address
      bucket
      time
    }
    year: graph_bucket(
      args: {
        interval_: "1 month"
        limit_: 12
        network_: $network
        address: $address
      }
    ) {
      amount
      sender_address
      bucket
      time
    }
  }
`;

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

type GraphDataAllBody = {
  variables: {
    network: string;
  };
  query: string;
};

type GraphDataByUserBody = {
  variables: {
    network: string;
    address: string;
  };
  query: string;
};

const useGraphDataAll = async (network: string) => {
  const variables = { network };
  const { url, headers } = fetchInternalEndpoint();
  const body = {
    variables,
    query: QUERY_ALL,
  };

  return await jsonPost<GraphDataAllBody, GraphDataResponse>(
    url,
    body,
    headers
  );
};

const useGraphDataByUser = async (network: string, address: string) => {
  const variables = { network, address };
  const { url, headers } = fetchInternalEndpoint();
  const body = {
    variables,
    query: QUERY_BY_USER,
  };

  return await jsonPost<GraphDataByUserBody, GraphDataResponse>(
    url,
    body,
    headers
  );
};

export { useGraphDataAll, useGraphDataByUser };
