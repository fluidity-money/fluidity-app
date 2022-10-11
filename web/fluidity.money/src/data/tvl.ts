// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useMemo } from 'react';
import { gql, useSubscription } from '@apollo/client';
import { onData } from "./apolloClient";

export interface Tvl {
  tvl: number,
  time: string,
  contract_address: string,
  network: string,
}

export interface TvlRes {
  tvl_staging: Tvl[],
}


const liveTvlSubscription = gql`
subscription tvlLiveTvlSubscription {
  tvl_staging(order_by: {contract_address: desc}, distinct_on: contract_address) {
    tvl
    time
    contract_address
    network
  }
} 
`

const useLiveTvl = (onNext: (data: TvlRes) => void) => {
  const { subscription, options } = useMemo(() => {
    return {
      subscription: liveTvlSubscription,
      options: {
        onData: onData(onNext),
      }
    }
  }, []);

  return useSubscription(subscription, options)
}

export { useLiveTvl }