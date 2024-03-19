import BN from "bn.js";

import FluidityFacadeContext from "./FluidityFacade";
import { Token } from "~/util/chainUtils/tokens";
import { createNetworkConfig, SuiClientProvider, useAutoConnectWallet, useCurrentAccount, useCurrentWallet, useDisconnectWallet, useSignAndExecuteTransactionBlock, useSuiClient, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { internalSwap, getBalance } from "~/util/chainUtils/sui/util";

const SuiFacade = ({
  children,
  tokens,
}: {
  children: React.ReactNode;
  tokens: Token[];
}) => {

  const { address } = useCurrentAccount() || {}
  const { isConnecting, isConnected } = useCurrentWallet()
  const { mutate } = useDisconnectWallet()
  const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock()
  const suiClient = useSuiClient()
  // TODO work out auto connect
  // const autoConnect = useAutoConnectWallet()

  const disconnect = async () => mutate()

  const swap = async (amount: string, tokenAddr: string) => {
    const fromToken = tokens.find((t) => t.address === tokenAddr);

    if (!fromToken)
      throw new Error(
        `Could not initiate Swap: Could not find matching token ${tokenAddr} in sui`
      );

    // true if swapping from fluid -> non-fluid
    const fromFluid = !!fromToken.isFluidOf;

    const toToken = fromFluid
      ? tokens.find((t) => t.address === fromToken.isFluidOf)
      : tokens.find((t) => t.isFluidOf === fromToken.address);

    if (!toToken)
      throw new Error(
        `Could not initiate Swap: Could not find dest pair token from ${tokenAddr} in sui`
      );

    return internalSwap(
      suiClient,
      address,
      amount,
      fromToken,
      toToken,
      signAndExecuteTransactionBlock
    );
  };

  const balance = async (tokenAddr: string): Promise<BN> => {
    const { suiTypeName } = tokens.find((t) => t.address === tokenAddr) || {};

    if (!suiTypeName)
      throw new Error(
        `Could not fetch balance: Could not find matching token ${tokenAddr} in sui`
      );

    return getBalance(suiClient, address, suiTypeName)
  };

  const getFluidTokens = async (): Promise<string[]> => {
    if (!address) return [];

    const fluidTokens = tokens.filter((t) => t.isFluidOf);

    const fluidTokensPosBalance = await Promise.all(
      fluidTokens.filter(async (t) => getBalance(suiClient, address, t.address))
    );

    return fluidTokensPosBalance.map((t) => t.address);
  };

  return (
    <FluidityFacadeContext.Provider
      value={{
        connected: isConnected,
        disconnect,
        connecting: isConnecting,
        swap,
        balance,
        tokens: getFluidTokens,
        rawAddress: address,
        // sui addresses are case sensitive
        address,
      }}
    >
      {children}
    </FluidityFacadeContext.Provider>
  );
};

const SuiProvider = (rpcUrl: string, tokens: Token[]) => {
  const { networkConfig } = createNetworkConfig({
    mainnet: { url: rpcUrl },
  });

  const queryClient = new QueryClient();

  const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig}>
          <WalletProvider>
            <SuiFacade tokens={tokens}>{children}</SuiFacade>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    );
  };

  return Provider;
};
export default SuiProvider;
