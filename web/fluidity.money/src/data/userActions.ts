// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useMemo } from 'react';
import { graphql } from 'relay-runtime';
import { useSubscription } from 'react-relay';

export interface TransactionCount {
  user_actions_aggregate: {
    aggregate: {
      count: number,
    }
  }
}


const countTransactionsByNetworkSubscription = graphql`
subscription userActionsGetCountTransactionsByNetworkSubscription($network: network_blockchain!) {
  user_actions_aggregate(where: {network: {_eq: $network}}) {
    aggregate {
      count
    }
  }
}
`;

export const useCountTransactions = (onNext: (txCount: TransactionCount) => void, network: string) => {
  const countTransactions = useMemo(() => ({
    subscription: countTransactionsByNetworkSubscription,
    variables: {
      network,
    },
    onNext,
  }), [onNext, network]);
  
  return useSubscription(countTransactions as any);
}

