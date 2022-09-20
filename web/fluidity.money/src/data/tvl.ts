// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useMemo } from 'react';
import { graphql } from 'react-relay';
import { useSubscription } from 'react-relay';

export interface Tvl {
  tvl: number,
  time: string,
  contract_address: string,
  network: string,
}

export interface TvlRes {
  tvl: Tvl[],
}


const liveTvlSubscription = graphql`
subscription tvlLiveTvlSubscription {
  tvl(order_by: {time: desc}, distinct_on: contract_address) {
    tvl
    time
    contract_address
    network
  }
} 
`

const useLiveTvl = (onNext: (prizePool: TvlRes) => void) => {
  const liveTvl = useMemo(() => {
    return {
      subscription: liveTvlSubscription,
      variables: {},
      onNext,
    }
  }, [onNext]);

  return useSubscription(liveTvl as any)
}

export { useLiveTvl }