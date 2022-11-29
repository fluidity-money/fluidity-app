import { useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";

import {
  PhantomWalletAdapter,
  SolletWalletAdapter,
  SolflareWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  NightlyWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { solanaInstructions } from "~/util/chainUtils/solana/instructions";
import FluidityFacadeContext from "./FluidityFacade";
import {useCache} from "~/hooks/useCache";
import {BannedLoader} from "~/routes/$network/query/banned";

const SolanaFacade = ({ children }: { children: React.ReactNode }) => {
  const { connected, publicKey, disconnect, connecting } = useWallet();
  const {data, error} = useCache<BannedLoader>(`/ethereum/query/banned?address=${publicKey?.toString()|| ""}`);
  if (error)
    throw error;

  const {isBanned} = data || {isBanned: false};

  useEffect(() => {
    if (isBanned) {
      throw new Error(`Account is not allowed: ${publicKey?.toString()}`)
    }
  }, [isBanned]);

  const swap = async (amount: string, tokenAddr: string) => {
    const { status } = await fetch(
      `/solana/query/solanaSwap?amount=${amount}&tokenAddr=${tokenAddr}`
    );

    return status === 200
      ? {
          confirmTx: () => Promise.resolve(true),
          txHash: "",
        }
      : undefined;
  };

  return (
    <FluidityFacadeContext.Provider
      value={{
        connected,
        disconnect,
        connecting,
        swap,
        rawAddress: publicKey?.toString() ?? "",
        address: publicKey?.toString().toLowerCase() ?? "",
        ...solanaInstructions,
      }}
    >
      {children}
    </FluidityFacadeContext.Provider>
  );
};

const SolanaProvider = (rpcUrl: string) => {
  const Provider = ({ children }: { children: React.ReactNode }) => {
    const networkCluster = 0;
    const endpoint = useMemo(() => rpcUrl, [networkCluster]);

    // include more wallet suppport later once done with full implementation
    const wallets = useMemo(
      () => [
        new PhantomWalletAdapter(),
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
          <SolanaFacade>{children}</SolanaFacade>
        </WalletProvider>
      </ConnectionProvider>
    );
  };

  return Provider;
};
export default SolanaProvider;
