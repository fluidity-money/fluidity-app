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
import {
  getBalance,
  internalSwap,
  limit,
  amountMinted,
} from "~/util/chainUtils/solana/instructions";
import FluidityFacadeContext from "./FluidityFacade";
import { Token } from "~/util/chainUtils/tokens";

const SolanaFacade = ({
  children,
  tokens,
}: {
  children: React.ReactNode;
  tokens: Token[];
}) => {
  const { connected, publicKey, disconnect, connecting } = useWallet();

  const swap = async (amount: string, tokenAddr: string) => {
    const fromToken = tokens.find((t) => t.address === tokenAddr);

    if (!fromToken)
      throw new Error(
        `Could not initiate Swap: Could not find matching token ${tokenAddr} in solana`
      );

    // true if swapping from fluid -> non-fluid
    const fromFluid = !!fromToken.isFluidOf;

    const toToken = fromFluid
      ? tokens.find((t) => t.address === fromToken.isFluidOf)
      : tokens.find((t) => t.isFluidOf === fromToken.address);

    if (!toToken)
      throw new Error(
        `Could not initiate Swap: Could not find dest pair token from ${tokenAddr} in solana`
      );

    return internalSwap(amount, fromToken, toToken);
  };

  const balance = async (tokenAddr: string): Promise<number> => {
    const token = tokens.find((t) => t.address === tokenAddr);

    if (!token)
      throw new Error(
        `Could not fetch balance: Could not find matching token ${tokenAddr} in solana`
      );

    return getBalance(token);
  };

  const getFluidTokens = async (): Promise<string[]> => {
    const fluidTokens = tokens.filter((t) => t.isFluidOf);

    const fluidTokensPosBalance = await Promise.all(
      fluidTokens.filter(async (t) => getBalance(t))
    );

    return fluidTokensPosBalance.map((t) => t.address);
  };

  return (
    <FluidityFacadeContext.Provider
      value={{
        connected,
        disconnect,
        connecting,
        swap,
        balance,
        limit,
        tokens: getFluidTokens,
        amountMinted,
        rawAddress: publicKey?.toString() ?? "",
        address: publicKey?.toString().toLowerCase() ?? "",
      }}
    >
      {children}
    </FluidityFacadeContext.Provider>
  );
};

const SolanaProvider = (rpcUrl: string, tokens: Token[]) => {
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
          <SolanaFacade tokens={tokens}>{children}</SolanaFacade>
        </WalletProvider>
      </ConnectionProvider>
    );
  };

  return Provider;
};
export default SolanaProvider;
