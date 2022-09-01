// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { Dispatch, SetStateAction } from "react";
import type { Winner, WinnersRes } from "../data/winners";
import type { PrizePool } from "../data/prizePool";
import type { TransactionCount } from "../data/userActions";

import { createContext, useContext, useState  } from "react";
import { SupportedChains, formatToGraphQLDate } from "surfing";
import { useWinningTransactions } from "../data/winners";
import { useLivePrizePool } from "../data/prizePool";
import { useCountTransactions } from "../data/userActions";

interface ChainState {
  chain: SupportedChains,
  setChain: Dispatch<SetStateAction<SupportedChains>>,
  apiState: ApiState,
}

interface ApiState {
  weekWinnings: Winner[],
  rewardPool: number,
  txCount: number,
}

const ChainContext = createContext<ChainState>(null!);

export const ChainContextProvider = ({children}: {children: JSX.Element | JSX.Element[]}) => {
  const [chain, setChain] = useState<SupportedChains>(SupportedChains.ETH);

  const [weekWinnings, setWeekWinnings] = useState<Winner[]>([]);
  const [rewardPool, setRewardPool] = useState(0);
  const [txCount, setTxCount] = useState(0);

  const apiState = {
    weekWinnings,
    rewardPool,
    txCount,
  }

  const prevWeekDate = new Date();
  prevWeekDate.setDate(prevWeekDate.getDate() - 7)

  useWinningTransactions(
    (winner: WinnersRes) => setWeekWinnings(winner.winners),
    chain,
    formatToGraphQLDate(prevWeekDate),
  )

  useLivePrizePool((prizePool: PrizePool) => setRewardPool(
    prizePool.prize_pool
      .filter(({network}) => network === chain)
      .reduce((latestPool, pool) => latestPool.last_updated > pool.last_updated ? latestPool : pool)
      .amount
  ));

  useCountTransactions(
    (txCount: TransactionCount) => setTxCount(
      txCount.user_actions_aggregate.aggregate.count
    ),
    chain,
  );
  
  return (
    <ChainContext.Provider value={{chain, setChain, apiState}}>
      {children}
    </ChainContext.Provider>
  );
};

export const useChainContext = () => {
  return useContext(ChainContext)
};

