// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

export type LargestDailyWinner = {
    network: string;
    transaction_hash: string;
    winning_address: string;
    awarded_day: string;
    token_short_name: string;
    winning_amount_scaled: number;
}

export type LargestMonthlyWinnersRes = {
  highest_rewards_monthly: LargestDailyWinner[],
}

const largestDailyWinnersMonthlyQuery = gql`
query HighestRewards($network: network_blockchain!) {
  highest_rewards_monthly(where: {network: {_eq: $network}}) {
    network
    transaction_hash
    winning_address
    awarded_time
    token_short_name
    winning_amount_scaled
  }
}
`;

const useHighestRewardStatistics = (onNext: (winnings: LargestMonthlyWinnersRes) => void, network: string) => {
  const { query, options } = useMemo(() => ({
    query: largestDailyWinnersMonthlyQuery,
    options: {
      variables: {
        network,
      },
      onCompleted: onNext,
    }
  }), [network]);

  return useQuery(query, options);

};

export { useHighestRewardStatistics };
