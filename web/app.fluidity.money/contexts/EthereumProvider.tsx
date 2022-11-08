import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import tokenAbi from "~/util/chainUtils/ethereum/Token.json"

import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";

import { FluidityFacadeContext } from "./IFluidityFacade";
import { ReactNode, useState } from "react";
import {usdBalanceOfERC20} from "~/util/chainUtils/ethereum/transaction";

const EthereumFacade = ({ children }: { children: ReactNode }) => {
  const { isActive, isActivating, provider, account} = useWeb3React();

  const [connector, setConnectorType] = useState("");

  const getBalance = async(contractAddress: string): Promise<number> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return 0;
    }

    return await usdBalanceOfERC20(signer, contractAddress, tokenAbi);
  }

  return (
    <FluidityFacadeContext.Provider value={{
      swap: async(amount, token) => {},
      limit: async(token) => 0,
      balance: getBalance,
      disconnect: async() => {},
      useConnectorType: setConnectorType,
      address: account,
      connected: isActive,
    }}>
      {children}
    </FluidityFacadeContext.Provider>
  );
};

export const EthereumProvider =
  (rpcUrl: string) =>
  ({ children }: { children: React.ReactNode }) => {
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

    return (
      <>
        <Web3ReactProvider connectors={connectors}>
          <EthereumFacade>{children}</EthereumFacade>
        </Web3ReactProvider>
      </>
    );
  };

export default EthereumProvider;
