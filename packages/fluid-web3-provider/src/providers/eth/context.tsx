import {
  useBlockHistory,
  useRewardHistory,
  useUserTokenHistory,
  _web3,
} from "./hooks";
import { createContext, useEffect, useState } from "react";

const pubSubFx = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const subscribe = (fn: any) => {
    setSubscribers([...subscribers, fn]);
    return {
      unsubscribe: () => {
        setSubscribers(subscribers.filter((s) => s !== fn));
      },
    };
  };

  const publish = (data: unknown) => {
    subscribers.forEach((fn) => fn(data));
  };

  return [publish, subscribe];
};

const FluidityEthereum = createContext<any>({
  blockHistory: [],
  userTokenHistory: [],
  tokenHistoryStatus: "loading",
  rewardHistory: [],
  subscribe: () => {},
});

const FluidityEthereumProvider = ({
  children,
  address,
  provider = _web3.givenProvider,
  tokenAddresses,
}) => {
  const [publish, subscribe] = pubSubFx();

  // Ensure we have a provider
  useEffect(() => {
    _web3.setProvider(provider);
  }, [provider]);

  const [blockHistory, fetchBlocks] = useBlockHistory();

  // Combine disjoint token histories
  const historyCombinator = (tokenAddresses, address) => {
    return tokenAddresses
      .map((contractAddress) => {
        const [tokenHistory, status] = useUserTokenHistory(
          address,
          contractAddress,
          publish
        );
        return {
          status,
          rewardHistory: useRewardHistory(contractAddress),
          userTokenHistory: tokenHistory,
        };
      })
      .reduce(
        (acc, curr) => {
          return {
            rewardHistory: [...acc.rewardHistory, ...curr.rewardHistory].sort(
              (a, b) => a.blockNumber - b.blockNumber
            ),
            userTokenHistory: [
              ...acc.userTokenHistory,
              ...curr.userTokenHistory,
            ].sort((a, b) => a.blockNumber - b.blockNumber),
            // if any of the token histories are loading, then the overall status is loading
            status: curr.status === "ready" ? acc.status : curr.status,
          };
        },
        { rewardHistory: [], userTokenHistory: [], status: "ready" }
      );
  };

  // merge all token histories into one array
  const { rewardHistory, userTokenHistory, status } = historyCombinator(
    tokenAddresses,
    address
  );

  fetchBlocks([
    ...rewardHistory.map((h) => h.blockNumber),
    ...userTokenHistory.map((h) => h.blockNumber),
  ]); // Get any new blocks and queue them for fetching

  // Apply the block timestamps to all user and reward histories
  const timedHistory = (history) => {
    history.map((h) => {
      const block = blockHistory.find((b) => b.number === h.blockNumber);
      return {
        ...h,
        timestamp: block ? block.timestamp : "Pending",
      };
    });
  };

  const timedRewardHistory = timedHistory(rewardHistory);
  const timedUserTokenHistory = timedHistory(userTokenHistory);

  return (
    <FluidityEthereum.Provider
      value={{
        blockHistory,
        userTokenHistory: timedUserTokenHistory,
        rewardHistory: timedRewardHistory,
        tokenHistoryStatus: status,
        subscribe,
      }}
    >
      {children}
    </FluidityEthereum.Provider>
  );
};

export { FluidityEthereum, FluidityEthereumProvider };
