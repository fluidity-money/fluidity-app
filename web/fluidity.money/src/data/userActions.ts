// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useMemo } from 'react';
import { gql, useSubscription } from "@apollo/client";
import { onData } from "./apolloClient";

export interface TransactionCount {
  user_actions_staging_aggregate: {
    aggregate: {
      count: number,
    }
  }
}


const countTransactionsByNetworkSubscription = gql`
subscription userActionsGetCountTransactionsByNetworkSubscription($network: network_blockchain!) {
  user_actions_staging_aggregate(where: {network: {_eq: $network}}) {
    aggregate {
      count
    }
  }
}
`;

export const useCountTransactions = (onNext: (txCount: TransactionCount) => void, network: string) => {
  const { subscription, options } = useMemo(() => ({
    subscription: countTransactionsByNetworkSubscription,
    options: {
      variables: {
        network,
      },
      onData: onData(onNext),
    }
  }), [network]);
  
  return useSubscription(subscription, options);
}

