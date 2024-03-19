import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";

import {
  useLeaderboardRanking24Hours,
  useByUserLeaderboardRanking24Hours,
  LeaderboardRanking,
  LeaderboardRankingRes,
  useLeaderboardRankingAllTime,
  useByUserLeaderboardRankingAllTime,
} from "./useLeaderboardRanking";

export type Network = "arbitrum" | "ethereum" | "solana";

type ChainData = {
  data?: string;
  loading: boolean;
};

interface ApiState {
  leaderboardRanking24Hours: LeaderboardRanking[];
  leaderboardRankingAllTime: LeaderboardRanking[];
  dataUser24Hours: LeaderboardRanking[];
  dataUserAllTime: LeaderboardRanking[];
}

interface ChainState {
  network: Network;
  userAddress?: string;
  apiState: ApiState;
}

const initChainState = (): ChainState => {
  return {
    network: "arbitrum",
    userAddress: " ",
    apiState: {
      leaderboardRanking24Hours: [],
      leaderboardRankingAllTime: [],
      dataUser24Hours: [],
      dataUserAllTime: [],
    },
  };
};

const ChainContext = createContext<ChainState>(initChainState());

const ChainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const network: Network = "arbitrum";

  const [leaderboardRanking24Hours, setLeaderboardRanking24Hours] = useState<
    LeaderboardRanking[]
  >([]);
  const [leaderboardRankingAllTime, setLeaderboardRankingAllTime] = useState<
    LeaderboardRanking[]
  >([]);

  const [dataUser24Hours, setDataUser24Hours] = useState<LeaderboardRanking[]>(
    []
  );

  const [dataUserAllTime, setDataUserAllTime] = useState<LeaderboardRanking[]>(
    []
  );

  const { address: userAddress, connector, isConnected } = useAccount();

  const [onChainData, setOnChainData] = useState<ChainData>({
    data: undefined,
    loading: false,
  });

  const apiState = {
    leaderboardRanking24Hours,
    leaderboardRankingAllTime,
    dataUser24Hours,
    dataUserAllTime,
    onChainData,
  };

  useLeaderboardRanking24Hours(
    ({ leaderboard_ranking }: LeaderboardRankingRes) =>
      setLeaderboardRanking24Hours(leaderboard_ranking),
    network
  );

  useByUserLeaderboardRanking24Hours(
    ({ leaderboard_ranking }: LeaderboardRankingRes) =>
      setDataUser24Hours(leaderboard_ranking),
    network,
    String(userAddress)
  );

  useLeaderboardRankingAllTime(
    ({ leaderboard_ranking }: LeaderboardRankingRes) =>
      setLeaderboardRankingAllTime(leaderboard_ranking),
    network
  );

  useByUserLeaderboardRankingAllTime(
    ({ leaderboard_ranking }: LeaderboardRankingRes) =>
      setDataUserAllTime(leaderboard_ranking),
    network,
    String(userAddress)
  );

  useEffect(() => {
    setOnChainData({ data: undefined, loading: true });
  }, []);

  return (
    <ChainContext.Provider value={{ network, userAddress, apiState }}>
      {children}
    </ChainContext.Provider>
  );
};

const useChainContext = () => {
  return useContext(ChainContext);
};

export { ChainContextProvider, useChainContext };
