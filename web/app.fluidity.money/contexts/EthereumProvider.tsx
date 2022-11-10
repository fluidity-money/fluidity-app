import type { ReactNode } from "react";
import type { Web3ReactHooks } from "@web3-react/core";
import type { Connector } from "@web3-react/types";

import tokenAbi from "~/util/chainUtils/ethereum/Token.json";
import { useMemo } from "react";
import {
  useWeb3React,
  Web3ReactProvider,
  initializeConnector,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import FluidityFacadeContext from "./FluidityFacade";
import makeContractSwap, {
  ContractToken,
  getUsdUserMintLimit,
  usdBalanceOfERC20,
} from "~/util/chainUtils/ethereum/transaction";
import { getTokenFromAddress, Token } from "~/util/chainUtils/tokens";

const EthereumFacade = ({
  children,
  tokens,
  connectors,
}: {
  children: ReactNode;
  tokens: Token[];
  connectors: [Connector, Web3ReactHooks][];
}) => {
  const { isActive, provider, account, connector } = useWeb3React();

  const getBalance = async (contractAddress: string): Promise<number> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return 0;
    }

    return await usdBalanceOfERC20(signer, contractAddress, tokenAbi);
  };

  // find and activate corresponding connector
  const useConnectorType = (type: "metamask" | "walletconnect" | string) => {
    let connector: Connector | undefined;
    switch (type) {
      case "metamask":
        connector = connectors.find(
          (connector) => connector[0] instanceof MetaMask
        )?.[0];
        break;
      case "walletconnect":
        connector = connectors.find(
          (connector) => connector[0] instanceof WalletConnect
        )?.[0];
        break;
      default:
        console.warn("Unsupported connector", type);
        break;
    }
    connector?.activate();
  };

  const deactivate = async (): Promise<void> => connector.deactivate?.();

  // the per-user mint limit for the given contract
  const limit = async (contractAddress: string): Promise<number> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return 0;
    }

    return await getUsdUserMintLimit(signer, contractAddress, tokenAbi);
  };

  // swap <symbol> to its counterpart, with amount in its own units
  // e.g. swap $1.6 of USDC to fUSDC: swap("1600000", "USDC")
  const swap = async (
    amount: string,
    contractAddress: string
  ): Promise<void> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return;
    }

    const { symbol } = getTokenFromAddress("ethereum", contractAddress) || {};

    const fromToken = tokens.find((t) => t.symbol === symbol);

    if (!fromToken) {
      return;
    }

    // true if swapping from fluid -> non-fluid
    const fromFluid = !!fromToken.isFluidOf;

    // if swapping from fluid, to its non-fluid counterpart
    // otherwise opposite
    const toToken = fromFluid
      ? tokens.find((t) => t.address === fromToken.isFluidOf)
      : tokens.find((t) => t.isFluidOf === fromToken.address);

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
    };

    makeContractSwap(signer, from, to, amount);
  };

  return (
    <FluidityFacadeContext.Provider
      value={{
        swap,
        limit,
        balance: getBalance,
        disconnect: deactivate,
        useConnectorType,
        address: account,
        connected: isActive,
      }}
    >
      {children}
    </FluidityFacadeContext.Provider>
  );
};

export const EthereumProvider =
  (rpcUrl: string, tokens: Token[]) =>
  ({ children }: { children: React.ReactNode }) => {
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
          <EthereumFacade tokens={tokens} connectors={connectors}>
            {children}
          </EthereumFacade>
        </Web3ReactProvider>
      </>
    );
  };

export default EthereumProvider;
