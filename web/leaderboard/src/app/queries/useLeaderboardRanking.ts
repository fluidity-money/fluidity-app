import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

export const queryByUserLeaderboardRanking24Hours = gql`
  query LeaderboardRanking($address: String!) {
    leaderboard_ranking(
      args: { i: "1 day", network_: "arbitrum" }
      limit: 1
      where: { address: { _eq: $address } }
    ) {
      address
      number_of_transactions
      rank
      volume
      yield_earned
    }
  }
`;

export const queryLeaderboardRanking24Hours = gql`
  query LeaderboardRanking($limit: Int = 40) {
    leaderboard_ranking(
      args: { i: "1 day", network_: "arbitrum" }
      limit: $limit
      order_by: { number_of_transactions: desc }
    ) {
      address
      number_of_transactions
      rank
      volume
      yield_earned
    }
  }
`;

export const queryLeaderboardRankingAllTime = gql`
  query LeaderboardRanking($limit: Int = 40) {
    leaderboard_ranking(
      args: { network_: "arbitrum" }
      limit: $limit
      order_by: { number_of_transactions: desc }
    ) {
      address
      number_of_transactions
      rank
      volume
      yield_earned
    }
  }
`;

export const queryByUserLeaderboardRankingAllTime = gql`
  query LeaderboardRanking($address: String!) {
    leaderboard_ranking(
      args: { network_: "arbitrum" }
      limit: 1
      where: { address: { _eq: $address } }
    ) {
      address
      number_of_transactions
      rank
      volume
      yield_earned
    }
  }
`;

export const queryLeaderboardRanking24Hour = gql`
  query LeaderboardRanking($limit: Int = 40) {
    leaderboard_ranking(
      args: { i: "1 day", network_: $network }
      limit: $limit
      order_by: { number_of_transactions: desc }
    ) {
      address
      number_of_transactions
      rank
      volume
      yield_earned
    }
  }
`;

export type LeaderboardRanking = {
  rank?: number;
  address: string;
  volume: string | number;
  number_of_transactions: number;
  yield_earned: string;
};

export type LeaderboardRankingRes = {
  leaderboard_ranking: LeaderboardRanking[];
};

const useLeaderboardRanking24Hours = (
  onNext: (ranking: LeaderboardRankingRes) => void,
  network: string
) => {
  const { query, options } = useMemo(
    () => ({
      query: queryLeaderboardRanking24Hour,
      options: {
        variables: {
          network,
        },
        onCompleted: onNext,
      },
    }),
    [network, onNext]
  );

  return useQuery(query, options);
};

const useByUserLeaderboardRanking24Hours = (
  onNext: (ranking: LeaderboardRankingRes) => void,
  network: string,
  address: string
) => {
  const { query, options } = useMemo(
    () => ({
      query: queryByUserLeaderboardRanking24Hours,
      options: {
        variables: {
          network,
          address,
        },
        onCompleted: onNext,
      },
    }),
    [network, onNext, address]
  );

  return useQuery(query, options);
};

const useLeaderboardRankingAllTime = (
  onNext: (ranking: LeaderboardRankingRes) => void,
  network: string
) => {
  const { query, options } = useMemo(
    () => ({
      query: queryLeaderboardRankingAllTime,
      options: {
        variables: {
          network,
        },
        onCompleted: onNext,
      },
    }),
    [network, onNext]
  );

  return useQuery(query, options);
};

const useByUserLeaderboardRankingAllTime = (
  onNext: (ranking: LeaderboardRankingRes) => void,
  network: string,
  address: string
) => {
  const { query, options } = useMemo(
    () => ({
      query: queryByUserLeaderboardRankingAllTime,
      options: {
        variables: {
          network,
          address,
        },
        onCompleted: onNext,
      },
    }),
    [network, onNext, address]
  );

  return useQuery(query, options);
};

export {
  useLeaderboardRanking24Hours,
  useByUserLeaderboardRanking24Hours,
  useLeaderboardRankingAllTime,
  useByUserLeaderboardRankingAllTime,
};
