import React, { useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import {
  Program,
  AnchorProvider,
} from '@coral-xyz/anchor';
import { Connection } from '@solana/web3.js';
import {
  PhantomWalletAdapter,
  SolletWalletAdapter,
  SolflareWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  NightlyWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import FluidityFacadeContext from './FluidityFacade';
import associateAddressForAirdropIdl from '~/util/chainUtils/solana/associate-address-for-airdrop-idl.json';
import { PublicKey } from '@solana/web3.js';
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
