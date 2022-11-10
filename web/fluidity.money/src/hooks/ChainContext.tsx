// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { Dispatch, SetStateAction } from "react";
import type { Winner, WinnersRes } from "data/winners";
import type { LargestDailyWinner, LargestMonthlyWinnersRes } from "data/monthlyLargestWinners";
import type { Tvl, TvlRes } from "data/tvl";
import type { TransactionCount } from "data/userActions";

import { createContext, useContext, useState } from "react";
import { SupportedChains, SupportedChainsList, formatToGraphQLDate } from "@fluidity-money/surfing";
import { useWinningTransactions } from "data/winners";
import { useLiveTvl } from "data/tvl";
import { useCountTransactions } from "data/userActions";
import { useHighestRewardStatistics } from "data/monthlyLargestWinners";

interface ChainState {
  chain: SupportedChainsList,
  network: Network,
  setChain: Dispatch<SetStateAction<SupportedChainsList>>,
  apiState: ApiState,
}

interface ApiState {
  weekWinnings: Winner[],
  largestDailyWinnings: LargestDailyWinner[],
  rewardPool: number,
  txCount: number,
}

export type Network = "STAGING" | "MAINNET";

const initChainState = (): ChainState => {
  return {
    chain: "ETH",
    network: "MAINNET",
    setChain: () => {},
    apiState: {
      weekWinnings: [],
      largestDailyWinnings: [],
      rewardPool: 0,
      txCount: 0,
    }
  }
}

const ChainContext = createContext<ChainState>(initChainState());

const ChainContextProvider = ({children}: {children: JSX.Element | JSX.Element[]}) => {
  const [chain, setChain] = useState<SupportedChainsList>("ETH");
  
  const network: Network = "MAINNET";

  const [weekWinnings, setWeekWinnings] = useState<Winner[]>([]);
  const [largestDailyWinnings, setLargestDailyWinnings] = useState<LargestDailyWinner[]>([]);
  const [rewardPool, setRewardPool] = useState(0);
  const [txCount, setTxCount] = useState(0);

  const apiState = {
    weekWinnings,
    largestDailyWinnings,
    rewardPool,
    txCount,
  }

  const prevWeekDate = new Date();
  prevWeekDate.setDate(prevWeekDate.getDate() - 7);
  
  useHighestRewardStatistics(
    ({highest_rewards_monthly}: LargestMonthlyWinnersRes) => setLargestDailyWinnings(
      highest_rewards_monthly
    ),
    SupportedChains[chain].name,
  )

  useWinningTransactions(
    ({winners}: WinnersRes) => setWeekWinnings(
      winners
    ),
    SupportedChains[chain].name,
    // formatToGraphQLDate(prevWeekDate),
  )
  
  useLiveTvl(({ tvl }: TvlRes) => {
    const latestNetworkPools = tvl
      .filter(({network}) => network === SupportedChains[chain].name)
      .reduce((pools, pool) => {
        const prevPool = pools[pool.contract_address];
        const poolFound = !!prevPool;

        if (!poolFound) return {
          ...pools,
          [pool.contract_address]: pool
        }

        return ({
          ...pools,
          [pool.contract_address]: prevPool.time > pool.time ? prevPool : pool
        })
      }, {} as {[key: string]: Tvl});
    
    setRewardPool(
      Object.values(latestNetworkPools)
        .reduce((sum, pool) => sum + pool.tvl, 0)
    )
  });

  useCountTransactions(
    (txCount: TransactionCount) => setTxCount(
      txCount
        .user_actions_aggregate
        .aggregate
        .count
    ),
    SupportedChains[chain].name,
  );
  
  return (
    <ChainContext.Provider value={{chain, network, setChain, apiState}}>
      {children}
    </ChainContext.Provider>
  );
};

const useChainContext = () => {
  return useContext(ChainContext)
};

export { ChainContextProvider, useChainContext };

