// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.
import type { RewardPoolRes } from "pages/api/reward_pool";

import { Dispatch, SetStateAction, useEffect } from "react";
import type { Winner, WinnersRes } from "data/winners";
import type {
  LargestDailyWinner,
  LargestMonthlyWinnersRes,
} from "data/monthlyLargestWinners";
import type { TransactionCount } from "data/userActions";

import { createContext, useContext, useState } from "react";
import { SupportedChains, SupportedChainsList } from "@fluidity-money/surfing";
import { useWinningTransactions } from "data/winners";
import { useCountTransactions } from "data/userActions";
import { useHighestRewardStatistics } from "data/monthlyLargestWinners";

interface ChainState {
  chain: SupportedChainsList;
  network: Network;
  setChain: Dispatch<SetStateAction<SupportedChainsList>>;
  apiState: ApiState;
}

type onChainData = {
  data:
  | {
    ethPool: number;
    solPool: number;
    arbPool: number;
    totalTransactions: number;
  }
  | undefined;
  loading: boolean;
};

interface ApiState {
  weekWinnings: Winner[];
  largestDailyWinnings: LargestDailyWinner[];
  onChainData: onChainData;
}

export type Network = "STAGING" | "MAINNET";

const initChainState = (): ChainState => {
  return {
    chain: "ARB",
    network: "MAINNET",
    setChain: () => { },
    apiState: {
      weekWinnings: [],
      largestDailyWinnings: [],
      onChainData: { data: undefined, loading: false },
    },
  };
};

const ChainContext = createContext<ChainState>(initChainState());

const ChainContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [chain, setChain] = useState<SupportedChainsList>("ARB");

  const network: Network = "MAINNET";

  const [weekWinnings, setWeekWinnings] = useState<Winner[]>([]);
  const [largestDailyWinnings, setLargestDailyWinnings] = useState<
    LargestDailyWinner[]
  >([]);
  const [onChainData, setOnChainData] = useState<onChainData>({
    data: undefined,
    loading: false,
  });
  const [txCount, setTxCount] = useState(0);

  const apiState = {
    weekWinnings,
    largestDailyWinnings,
    onChainData,
    txCount,
  };

  const prevWeekDate = new Date();
  prevWeekDate.setDate(prevWeekDate.getDate() - 7);

  useHighestRewardStatistics(
    ({ highest_rewards_monthly }: LargestMonthlyWinnersRes) =>
      setLargestDailyWinnings(highest_rewards_monthly),
    SupportedChains[chain].name
  );

  useWinningTransactions(
    ({ winners }: WinnersRes) => setWeekWinnings(winners),
    SupportedChains[chain].name
    // formatToGraphQLDate(prevWeekDate),
  );

  useCountTransactions(
    (txCount: TransactionCount) =>
      setTxCount(txCount.user_actions_aggregate.aggregate.count),
    SupportedChains[chain].name
  );

  useEffect(() => {
    setOnChainData({ data: undefined, loading: true });

    fetch("/api/reward_pool")
      .then((res) => res.json())
      .then((data: RewardPoolRes) => {
        setOnChainData({
          data: {
            ethPool: Number(data.ethPool),
            solPool: Number(data.solPool),
            arbPool: Number(data.arbPool),
            totalTransactions: Number(data.totalTransactions),
          },
          loading: false,
        });
      });
  }, []);

  return (
    <ChainContext.Provider value={{ chain, network, setChain, apiState }}>
      {children}
    </ChainContext.Provider>
  );
};

const useChainContext = () => {
  return useContext(ChainContext);
};

export { ChainContextProvider, useChainContext };
