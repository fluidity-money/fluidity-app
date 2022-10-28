// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useMemo } from 'react';
import { gql, useSubscription } from "@apollo/client";
import { onData } from "./apolloClient";

export interface Winner {
  awarded_time: string,
  token_decimals: number,
  token_short_name: string,
  transaction_hash: string,
  winning_amount: number,
  winning_address: string,
}

export interface WinnersRes {
  winners_staging: Winner[],
}


const winningTransactionsByAddressSubscription = gql`
subscription winnersGetWinningTransactionsByAddressSubscription($network: network_blockchain!, $address: String!, $date: timestamp!) {
  winners_staging(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, winning_address: {_eq: $address}, awarded_time: {_gte: $date}}) {
    awarded_time
    transaction_hash
    token_short_name
    winning_amount
    token_decimals
    winning_address
  }
}
`;

const winningTransactionsAllSubscription = gql`
subscription winnersGetWinningTransactionsAllSubscription($network: network_blockchain!, $date: timestamp!) {
  winners_staging(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, awarded_time: {_gte: $date}}) {
    awarded_time
    transaction_hash
    token_short_name
    winning_amount
    token_decimals
    winning_address
  }
}
`;

const winningTransactionsAnyTimeAllSubscription = gql`
subscription winnersGetWinningTransactionsAnyTimeAllSubscription($network: network_blockchain!) {
  winners_staging(order_by: {awarded_time: desc}, where: {network: {_eq: $network}}) {
    awarded_time
    transaction_hash
    token_short_name
    winning_amount
    token_decimals
    winning_address
  }
}
`;

export const useWinningTransactions = (onNext: (winnings: WinnersRes) => void, network: string, date?: string, address?: string) => {
  const { subscription, options } = useMemo(() => {
    if (!date) {
      return ({
        subscription: winningTransactionsAnyTimeAllSubscription,
        options: {
          variables: {
            network,
          },
          onData: onData(onNext),
        }
      })
    };
    
    if (!address) {
      return {
        subscription: winningTransactionsAllSubscription,
        options: {
          variables: {
            network,
            date,
          },
          onData: onData(onNext),
        },
      }
    };
    
    return {
      subscription: winningTransactionsByAddressSubscription,
      options: {
        variables: {
          network,
          address,
          date,
        },
        onData: onData(onNext),
      },
    }
  }, [network, address, date]);
  
  return useSubscription(subscription, options as any);
}

