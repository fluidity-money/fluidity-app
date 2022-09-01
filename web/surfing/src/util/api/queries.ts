// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { graphql, useSubscription } from 'react-relay';
import { useMemo } from 'react';

const winningTransactionsByAddressSubscription = graphql`
subscription queriesGetWinningTransactionsByAddressSubscription($network: network_blockchain!, $address: String!) {
  winners(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, winning_address: {_eq: $address}}) {
    awarded_time
    transaction_hash
    token_short_name
    winning_amount
    token_decimals
  }
}
`;

const winningTransactionsAllSubscription = graphql`
subscription queriesGetWinningTransactionsAllSubscription($network: network_blockchain!) {
  winners(order_by: {awarded_time: desc}, where: {network: {_eq: $network}}) {
    awarded_time
    transaction_hash
    token_short_name
    winning_amount
    token_decimals
  }
}
`;

export const useWinningTransactions = (network: string, address?: string) => {
  const winningTransactions = useMemo(() => (
    !!address
      ? ({
        winningTransactionsByAddressSubscription,
        variables: {
          network,
          address,
        }
      })
      : ({
        winningTransactionsAllSubscription,
        variables: {
          network,
        }
      })
  ), [network, address]);
  
  return useSubscription(winningTransactions as any);
}

