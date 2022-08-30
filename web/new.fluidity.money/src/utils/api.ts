// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { graphql, useSubscription } from 'react-relay';
import { useMemo } from 'react';

const winningTransactionsSubscription = graphql`
subscription getWinningTransactions($network: string!, $address: string!) {
  winners(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, winning_address: {_eq: $address}}) {
    awarded_time
    transaction_hash
    token_short_name
    winning_amount
    token_decimals
  }
}
`;

export const useWinningTransactions = (network: string, address: string) => {
  const winningTransactions = useMemo(() => {
    return {
      winningTransactionsSubscription,
      variables: {
        network,
        address,
      }
    }
  }, [network, address]);
  
  return useSubscription(winningTransactions as any);
}


