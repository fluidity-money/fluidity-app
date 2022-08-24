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