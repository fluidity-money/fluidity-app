import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolletWalletAdapter,
  SolflareWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  NightlyWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { Token } from '~/util/chainUtils/tokens';

const wallets = [
  new PhantomWalletAdapter(),
  new SolletWalletAdapter(),
  new SolflareWalletAdapter(),
  new NightlyWalletAdapter(),
  new CloverWalletAdapter(),
  new Coin98WalletAdapter(),
];

const SolanaFacade = dynamic(() => import('./SolanaFacade'), { ssr: false });

const SolanaProvider = (rpcUrl: string, tokens: Token[]) => {
  const endpoint = useMemo(() => rpcUrl, [rpcUrl]);

  const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <SolanaFacade tokens={tokens}>{children}</SolanaFacade>
        </WalletProvider>
      </ConnectionProvider>
    );
  };

  return Provider;
};

export default SolanaProvider;
