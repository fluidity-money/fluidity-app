"use client";

import * as React from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import { ApolloProvider } from "@apollo/client";

import { client } from "./utils/client";
import { ChainContextProvider } from "./queries/ChainContext";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

export const FLU_WALLETCONNECT_ID = "60cd988a2683be6b1787c53081016310";

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: FLU_WALLETCONNECT_ID,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={config}>
      {mounted && (
        <ApolloProvider client={client}>
          <ChainContextProvider>{children}</ChainContextProvider>
        </ApolloProvider>
      )}
    </WagmiConfig>
  );
}
