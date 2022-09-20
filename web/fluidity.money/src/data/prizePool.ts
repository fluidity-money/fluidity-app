// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useMemo } from 'react';
import { graphql } from 'relay-runtime';
import { useSubscription } from 'react-relay';

export interface PrizePool {
  prize_pool: {
    amount: number,
    last_updated: string,
    network: string,
  }[],
}


const livePrizePoolSubscription = graphql`
subscription prizePoolLivePrizePoolSubscription {
  prize_pool(order_by: {last_updated: desc, network: asc}, distinct_on: network) {
    amount
    last_updated
    network
  }
} 
`

const useLivePrizePool = (onNext: (prizePool: PrizePool) => void) => {
  const livePrizePool = useMemo(() => {
    return {
      subscription: livePrizePoolSubscription,
      variables: {},
      onNext,
    }
  }, [onNext]);

  return useSubscription(livePrizePool as any)
}

export { useLivePrizePool }