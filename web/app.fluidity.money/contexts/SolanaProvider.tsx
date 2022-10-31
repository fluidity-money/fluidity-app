import React, { useMemo } from "react";
import config from "~/webapp.config.server";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  PhantomWalletAdapter,
  SolletExtensionWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export default function SolanaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const networkCluster = 0;
  const rpc =
    process.env.REACT_APP_FLU_SOL_RPC === undefined
      ? ""
      : process.env.REACT_APP_FLU_SOL_RPC;
  const endpoint = useMemo(() => rpc, [networkCluster]);

  // include more wallet suppport later once done with full implementation
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolletExtensionWalletAdapter()],
    [networkCluster]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
