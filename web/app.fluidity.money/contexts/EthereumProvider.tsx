import type { ReactNode } from "react";
import type { Web3ReactHooks } from "@web3-react/core";
import type { Connector } from "@web3-react/types";

import { useState, useMemo } from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import FluidityFacadeContext from "./FluidityFacade";

const EthereumFacade = ({ children }: { children: ReactNode }) => {
  const { isActive, isActivating } = useWeb3React();

  const [connector, setConnectorType] = useState("");

  return (
    <FluidityFacadeContext.Provider value={{}}>
      {children}
    </FluidityFacadeContext.Provider>
  );
};

export const EthereumProvider =
  (rpcUrl: string) =>
  ({ children }: { children: ReactNode }) => {
    const connectors = useMemo(() => {
      const [metaMask, metamaskHooks] = initializeConnector<MetaMask>(
        (actions) => new MetaMask({ actions })
      );

      const [walletConnect, walletconnectHooks] =
        initializeConnector<WalletConnect>(
          (actions) =>
            new WalletConnect({
              actions,
              options: {
                rpc: {
                  1: rpcUrl,
                },
              },
            })
        );

      const connectors: [Connector, Web3ReactHooks][] = [
        [metaMask, metamaskHooks],
        [walletConnect, walletconnectHooks],
      ];

      const connectorHooks: { [key: string]: Web3ReactHooks } = {
        metaMask: metamaskHooks,
        walletConnect: walletconnectHooks,
      };

      return connectors;
    }, []);

    return (
      <>
        <Web3ReactProvider connectors={connectors}>
          <EthereumFacade>{children}</EthereumFacade>
        </Web3ReactProvider>
      </>
    );
  };

export default EthereumProvider;
