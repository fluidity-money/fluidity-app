import { useMemo } from "react";
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

const SolanaFacade = ({ children }: { children: React.ReactNode }) => {
  const { connected, publicKey, disconnect, connecting } = useWallet();

  console.log("connected", connected, "addr:", publicKey?.toString());

  return (
    <FluidityFacadeContext.Provider
      value={{
        connected,
        disconnect,
        connecting,
        address: publicKey?.toString() ?? "",
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
