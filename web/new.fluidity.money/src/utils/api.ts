import { graphql, useSubscription } from 'react-relay';
import { useMemo } from 'react';

const winningTransactionsSubscription = graphql`
subscription getWinningTransactions($network: string!, $address: string!) {
  winners(order_by: {awarded_time: desc}, where: {network: {_eq: $network}, winning_address: {_eq: $address}}) {
    awarded_time
    transaction_hash
    token_short_name
    winning_amount
    token_decimals
  }
}
`;

export const useWinningTransactions = (network: string, address: string) => {
  const winningTransactions = useMemo(() => {
    return {
      winningTransactionsSubscription,
      variables: {
        network,
        address,
      }
    }
  }, [network, address]);
  
  return useSubscription(winningTransactions as any);
}


