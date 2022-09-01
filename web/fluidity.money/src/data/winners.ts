// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useMemo } from 'react';
import { graphql } from 'babel-plugin-relay/macro';
import { useSubscription } from 'react-relay';

export interface Winner {
  awarded_time: string,
  token_decimals: number,
  token_short_name: string,
  transaction_hash: string,
  winning_amount: number,
  winning_address: string,
}

export interface WinnersRes {
  winners: {
    awarded_time: string,
    token_decimals: number,
    token_short_name: string,
    transaction_hash: string,
    winning_amount: number,
    winning_address: string,
  }[],
}


const winningTransactionsByAddressSubscription = graphql`
subscription winnersGetWinningTransactionsByAddressSubscription($network: network_blockchain!, $address: String!, $date: String!) {
  winners(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, winning_address: {_eq: $address}, awarded_time: {_gte: $date}}) {
    awarded_time
    transaction_hash
    token_short_name
    winning_amount
    token_decimals
    winning_address
  }
}
`;

const winningTransactionsAllSubscription = graphql`
subscription winnersGetWinningTransactionsAllSubscription($network: network_blockchain!, $date: String!) {
  winners(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, awarded_time: {_gte: $date}}) {
    awarded_time
    transaction_hash
    token_short_name
    winning_amount
    token_decimals
    winning_address
  }
}
`;

export const useWinningTransactions = (onNext: (winnings: WinnersRes) => void, network: string, date: string, address?: string) => {
  const winningTransactions = useMemo(() => (
    !!address
      ? {
        subscription: winningTransactionsByAddressSubscription,
        variables: {
          network,
          address,
          date,
        },
        onNext,
      }
      : {
        subscription: winningTransactionsAllSubscription,
        variables: {
          network,
          date,
        },
        onNext,
      }
  ), [onNext, network, address, date]);
  
  return useSubscription(winningTransactions as any);
}

