import { jsonPost, gql, fetchInternalEndpoint } from "~/util";

const queryByUser = gql`
  query TradingLeaderboard(
    $network: network_blockchain!
    $address: String!
    $application: String
    $start: timestamp
    $end: timestamp
  ) {
    trading_leaderboard(
      args: {
        network_: $network
        start_time: $start
        end_time: $end
        application: $application
        address: $address
      }
      limit: 1
    ) {
      address
      volume
    }
  }
`;

const queryAll = gql`
  query TradingLeaderboard(
    $network: network_blockchain!
    $application: String
    $start: timestamp
    $end: timestamp
  ) {
    trading_leaderboard(
      args: {
        network_: $network
        start_time: $start
        end_time: $end
        application: $application
      }
      limit: 16
    ) {
      address
      volume
    }
  }
`;

type TradingLeaderboardBody = {
  query: string;
};

type TradingLeaderboardAllBody = TradingLeaderboardBody & {
  variables: {
    network: string;
    start: string;
    end: string;
    application?: string;
  };
};

type TradingLeaderboardByUserBody = TradingLeaderboardBody & {
  variables: {
    network: string;
    start: string;
    end: string;
    address: string;
    application?: string;
  };
};

export type TradingLeaderboardEntry = {
  address: string;
  volume: number;
};

type TradingLeaderboardResponse = {
  data?: {
    trading_leaderboard: Array<TradingLeaderboardEntry>;
  };
  errors?: unknown;
};

export const useTradingCompLeaderboardByUser = (
  network: string,
  start: Date,
  end: Date,
  address: string,
  application?: string
) => {
  const { url, headers } = fetchInternalEndpoint();

  const variables = {
    network,
    start: start.toString(),
    end: end.toString(),
    address,
    application: application,
  };

  const body = {
    query: queryByUser,
    variables,
  };

  return jsonPost<TradingLeaderboardByUserBody, TradingLeaderboardResponse>(
    url,
    body,
    headers
  );
};

export const useTradingCompLeaderboardAll = (
  network: string,
  start: Date,
  end: Date,
  application?: string
) => {
  const { url, headers } = fetchInternalEndpoint();
  const variables = {
    network,
    start: start.toString(),
    end: end.toString(),
    application: application,
  };

  const body = {
    query: queryAll,
    variables,
  };

  return jsonPost<TradingLeaderboardAllBody, TradingLeaderboardResponse>(
    url,
    body,
    headers
  );
};
