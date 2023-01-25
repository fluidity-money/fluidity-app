type QueryOptions = {
  useMoralis: boolean
}

const defaultQueryOptions: QueryOptions = {
  useMoralis: true
}

import {
  useUserTransactionAllCount,
  useUserTransactionByAddressCount,
} from "./useUserTransactionCount";
import {
  useUserTransactionsAll,
  useUserTransactionsByAddress,
  useUserTransactionsByTxHash,
} from "./useUserTransactions";
import useUserUnclaimedRewards from "./useUserUnclaimedRewards";
import {
  useUserRewardsAll,
  useUserRewardsByAddress,
  useUserPendingRewardsAll,
  useUserPendingRewardsByAddress,
} from "./useUserRewards";
import { useUserYieldAll, useUserYieldByAddress } from "./useUserYield";

export type {
  QueryOptions
};

export {
  defaultQueryOptions,
  useUserTransactionAllCount,
  useUserTransactionByAddressCount,
  useUserTransactionsAll,
  useUserTransactionsByAddress,
  useUserTransactionsByTxHash,
  useUserUnclaimedRewards,
  useUserRewardsAll,
  useUserRewardsByAddress,
  useUserPendingRewardsAll,
  useUserPendingRewardsByAddress,
  useUserYieldAll,
  useUserYieldByAddress,
};
