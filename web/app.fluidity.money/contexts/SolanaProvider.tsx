import BN from "bn.js";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
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
  amountMinted as amountMintedInternal,
} from "~/util/chainUtils/solana/instructions";
import FluidityFacadeContext from "./FluidityFacade";
import { Token } from "~/util/chainUtils/tokens";
import {PublicKey} from "@solana/web3.js";

const SolanaFacade = ({
  children,
  tokens,
}: {
  children: React.ReactNode;
  tokens: Token[];
}) => {
  const wallet = useWallet();
  const { connected, publicKey, disconnect, connecting, signMessage } =
    wallet;
  const {connection} = useConnection();

  const swap = async (amount: string, tokenAddr: string) => {
    if (!publicKey)
      return;

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

    return internalSwap(wallet, connection, connected, publicKey, amount, fromToken, toToken);
  };

  const balance = async (tokenAddr: string): Promise<BN> => {
    const token = tokens.find((t) => t.address === tokenAddr);

    if (!token)
      throw new Error(
        `Could not fetch balance: Could not find matching token ${tokenAddr} in solana`
      );

    if (!publicKey)
      return new BN(0);

    return getBalance(connection, publicKey, token);
  };

  const signBuffer = async (buffer: string): Promise<string | undefined> => {
    const enc = new TextEncoder();

    return signMessage?.(enc.encode(buffer))?.then((val) => String(val));
  };

  const getFluidTokens = async (): Promise<string[]> => {
    if (!publicKey)
      return [];

    const fluidTokens = tokens.filter((t) => t.isFluidOf);

    const fluidTokensPosBalance = await Promise.all(
      fluidTokens.filter(async (t) => getBalance(connection, publicKey, t))
    );

    return fluidTokensPosBalance.map((t) => t.address);
  };
  
  const amountMinted = async(tokenName: string): Promise<BN | undefined> => {
    if (!publicKey)
      return;
    return amountMintedInternal(publicKey, tokenName)
  }

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
        signBuffer,
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
