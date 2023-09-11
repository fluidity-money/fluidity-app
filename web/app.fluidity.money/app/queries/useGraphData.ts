import { gql, jsonPost } from "~/util";
import { fetchInternalEndpoint } from "~/util";

const QUERY_ALL = {
  day: gql`
    query GraphDataDay($network: network_blockchain!) {
      day: graph_bucket(
        args: { interval_: "1 hour", limit_: 24, network_: $network }
      ) {
        amount
        sender_address
        bucket
        time
      }
    }
  `,
  week: gql`
    query GraphDataWeek($network: network_blockchain!) {
      week: graph_bucket(
        args: { interval_: "1 day", limit_: 7, network_: $network }
      ) {
        amount
        sender_address
        bucket
        time
      }
    }
  `,
  month: gql`
    query GraphDataMonth($network: network_blockchain!) {
      month: graph_bucket(
        args: { interval_: "1 day", limit_: 30, network_: $network }
      ) {
        amount
        sender_address
        bucket
        time
      }
    }
  `,
  year: gql`
    query GraphDataYear($network: network_blockchain!) {
      year: graph_bucket(
        args: { interval_: "1 month", limit_: 12, network_: $network }
      ) {
        amount
        sender_address
        bucket
        time
      }
    }
  `,
};

const QUERY_BY_USER = [
  gql`
    query GraphDataByAddressDay(
      $network: network_blockchain!
      $address: String!
    ) {
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
    }
  `,
  gql`
    query GraphDataByAddressWeek(
      $network: network_blockchain!
      $address: String!
    ) {
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
    }
  `,
  gql`
    query GraphDataByAddressMonth(
      $network: network_blockchain!
      $address: String!
    ) {
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
    }
  `,
  gql`
    query GraphDataByAddressYear(
      $network: network_blockchain!
      $address: String!
    ) {
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
  `,
];

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
  data?: { [name in keyof GraphData]: GraphEntry[] };
  errors?: Array<unknown>;
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
  // hasura queries are sequential when combined, so submit them separately then combine manually
  return (
    await Promise.all(
      Object.values(QUERY_ALL).map(async (query) => {
        const body = {
          variables,
          query,
        };

        return await jsonPost<GraphDataAllBody, GraphDataResponse>(
          url,
          body,
          headers
        );
      })
    )
  ).reduce(graphDataReducer);
};

const useGraphDataByUser = async (network: string, address: string) => {
  const variables = { network, address };
  const { url, headers } = fetchInternalEndpoint();

  // hasura queries are sequential when combined, so submit them separately then combine manually
  return (
    await Promise.all(
      Object.values(QUERY_BY_USER).map(async (query) => {
        const body = {
          variables,
          query,
        };

        return await jsonPost<GraphDataByUserBody, GraphDataResponse>(
          url,
          body,
          headers
        );
      })
    )
  ).reduce(graphDataReducer);
};

// graphDataReducer to combine the results of several queries into one
const graphDataReducer = (
  p: GraphDataResponse,
  c: GraphDataResponse
): GraphDataResponse => ({
  data: p.data || c.data ? ({ ...p.data, ...c.data } as GraphData) : undefined,
  // can't (...undefined), so nullish coalesce with []
  errors:
    p.errors || c.errors
      ? [...(p.errors || []), ...(c.errors || [])]
      : undefined,
});

export { useGraphDataAll, useGraphDataByUser };
