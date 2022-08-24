// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useMemo } from 'react';
import { graphql, useSubscription } from 'react-relay';

const subscription = graphql`
subscription LivePrivePoolSubscription($time: timestamp!) {
  prize_pool(where: {
    	last_updated: { _gte: $time }
  }) {
    amount
    last_updated
    network
  }
} 
`

const useLivePrizePool = (timestamp: string) => {
    const conf = useMemo(() => {
        return {
            subscription,
            variables: {
                time: timestamp
            }
        }
    }, [timestamp])

    return useSubscription(conf)
}

export { useLivePrizePool }