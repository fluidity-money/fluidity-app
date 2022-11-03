import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  PhantomWalletAdapter,
  SolletWalletAdapter,
  SolflareWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  NightlyWalletAdapter
} from "@solana/wallet-adapter-wallets";

const SolanaProvider =
  (rpcUrl: string) =>
  ({ children }: { children: React.ReactNode }) => {
    const networkCluster = 0;
    const endpoint = useMemo(() => rpcUrl, [networkCluster]);

  // include more wallet suppport later once done with full implementation
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), 
           new SolletWalletAdapter(),
           new SolflareWalletAdapter(),
           new NightlyWalletAdapter(),
           new CloverWalletAdapter(),
           new Coin98WalletAdapter(),
          ],
    [networkCluster]
  );

    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          {children}
        </WalletProvider>
      </ConnectionProvider>
    );
  };

export default SolanaProvider;
