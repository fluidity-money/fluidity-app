import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import tokenAbi from "~/util/chainUtils/ethereum/Token.json"

import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";

import { FluidityFacadeContext } from "./IFluidityFacade";
import { ReactNode, useEffect, useState } from "react";
import makeContractSwap, {ContractToken, usdBalanceOfERC20} from "~/util/chainUtils/ethereum/transaction";
import {Token} from "~/util/chainUtils/tokens";

const EthereumFacade = ({ children,  tokens}: { children: ReactNode, tokens: Token[]}) => {
  const { isActive, isActivating, provider, account, connector } = useWeb3React();

  const [connectorType, setConnectorType] = useState("");

  const getBalance = async(contractAddress: string): Promise<number> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return 0;
    }

    return await usdBalanceOfERC20(signer, contractAddress, tokenAbi);
  }

  useEffect(() => {
    console.warn("useConnectorType unimpl")
  }, [connectorType])

  const deactivate = async(): Promise<void> => connector.deactivate?.();

  // swap <symbol> to its counterpart, with amount in its own units
  // e.g. swap $1.6 of USDC to fUSDC: swap("1600000", "USDC")
  const swap = async(amount: string, symbol: string): Promise<void> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return;
    }

    const fromToken = tokens.find(t => t.symbol === symbol);

    if (!fromToken) {
      return;
    }

    // true if swapping from fluid -> non-fluid
    const fromFluid = !!fromToken.isFluidOf;


    // if swapping from fluid, to its non-fluid counterpart
    // otherwise opposite 
    const toToken = fromFluid ?
      tokens.find(t => t.address === fromToken.isFluidOf) :
      tokens.find(t => t.isFluidOf === fromToken.address);

    if (!toToken) {
      return;
    }

    const from: ContractToken = {
      address: fromToken.address,
      ABI: tokenAbi,
      symbol: fromToken.symbol,
      isFluidOf: fromFluid,
    };

    const to: ContractToken = {
      address: toToken.address,
      ABI: tokenAbi,
      symbol: toToken.symbol,
      isFluidOf: !fromFluid,
    }

    makeContractSwap(signer, from, to, amount);
  }

  return (
    <FluidityFacadeContext.Provider value={{
      swap,
      limit: async(token) => 0,
      balance: getBalance,
      disconnect: deactivate,
      useConnectorType: setConnectorType,
      address: account,
      connected: isActive,
    }}>
      {children}
    </FluidityFacadeContext.Provider>
  );
};

export const EthereumProvider =
  (rpcUrl: string, tokens: Token[]) =>
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
          <EthereumFacade tokens={tokens}>{children}</EthereumFacade>
        </Web3ReactProvider>
      </>
    );
  };

export default EthereumProvider;
