import type { ReactNode } from "react";
import type { Web3ReactHooks } from "@web3-react/core";
import type { Connector } from "@web3-react/types";
import type { TransactionResponse } from "~/util/chainUtils/instructions";

import { useConnectModal } from "@particle-network/connect-react-ui"
import { evmWallets, ParticleConnect } from "@particle-network/connect";
import tokenAbi from "~/util/chainUtils/ethereum/Token.json";
import BN from "bn.js";
import { useMemo, useEffect } from "react";
import {
  useWeb3React,
  Web3ReactProvider,
  initializeConnector,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import FluidityFacadeContext from "./FluidityFacade";

import RewardPoolAbi from "~/util/chainUtils/ethereum/RewardPool.json";
import {
  getTotalPrizePool,
  getUserMintLimit,
  userMintLimitEnabled,
  manualRewardToken,
} from "~/util/chainUtils/ethereum/transaction";
import makeContractSwap, {
  ContractToken,
  getAmountMinted,
  getBalanceOfERC20,
} from "~/util/chainUtils/ethereum/transaction";
import { Token } from "~/util/chainUtils/tokens";
import { Buffer } from "buffer";
import { Particle } from "~/util/chainUtils/ethereum/particle";

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

  // attempt to connect eagerly on mount
  // https://github.com/Uniswap/web3-react/blob/main/packages/example-next/components/connectorCards/MetaMaskCard.tsx#L20
  useEffect(() => {
    connectors.every(([connector]) => {
      connector?.connectEagerly?.()?.catch(() => {
        return true;
      });

      return false;
    });
  }, []);

  const getBalance = async (
    contractAddress: string
  ): Promise<BN | undefined> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return;
    }

    return await getBalanceOfERC20(signer, contractAddress, tokenAbi);
  };

  // find and activate corresponding connector
  const useConnectorType = (type: "metamask" | "walletconnect" | "particle" | string) => {
    let connector: any;
    switch (type) {
      case "metamask":
        connector = connectors.find(
          (connector) => connector[0] instanceof MetaMask
        )?.[0];
        return connector?.activate();
      case "walletconnect":
        connector = connectors.find(
          (connector) => connector[0] instanceof WalletConnect
        )?.[0];
        // Node Polyfills are no longer bundled with webpack
        // We manually re-add Node.Buffer to client
        // https://github.com/WalletConnect/web3modal/issues/455
        window.Buffer = Buffer;
        return connector?.activate();
      case "particle":
        connector = connectors.find(
          (connector) => connector[0] instanceof Particle
        )?.[0];
        window.Buffer = Buffer;
        console.log("connector", connector)
        return connector?.connect();
      default:
        console.warn("Unsupported connector", type);
        break;
    }
  };

  const deactivate = async (): Promise<void> => {
    // Metamask does not directly disconnect, so instead reset State
    // https://github.com/Uniswap/web3-react/blob/main/packages/example-next/components/ConnectWithSelect.tsx#L139
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }
  };

  // the per-user mint limit for the contract
  const limit = async (contractAddress: string): Promise<BN | undefined> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return;
    }

    const isEnabled = await userMintLimitEnabled(
      signer.provider,
      contractAddress,
      tokenAbi
    );

    if (!isEnabled) return;

    return await getUserMintLimit(signer.provider, contractAddress, tokenAbi);
  };

  // the user's minted amount towards the per-user total
  // call with a fluid token
  const amountMinted = async (contractAddress: string): Promise<BN> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return new BN(0);
    }

    return await getAmountMinted(
      signer.provider,
      contractAddress,
      tokenAbi,
      await signer.getAddress()
    );
  };

  // swap <symbol> to its counterpart, with amount in its own units
  // e.g. swap $1.6 of USDC to fUSDC: swap("1600000", "USDC")
  const swap = async (
    amount: string,
    contractAddress: string
  ): Promise<TransactionResponse | undefined> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return;
    }

    const fromToken = tokens.find((t) => t.address === contractAddress);

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

    const ethContractRes = await makeContractSwap(signer, from, to, amount);

    return ethContractRes
      ? {
          confirmTx: async () => (await ethContractRes.wait())?.status === 1,
          txHash: ethContractRes.hash,
        }
      : undefined;
  };

  const manualReward = async (
    fluidTokenAddrs: string[],
    userAddr: string
  ): Promise<
    | ({ amount: number; gasFee: number; networkFee: number } | undefined)[]
    | undefined
  > => {
    const signer = provider?.getSigner();

    if (!signer) {
      return;
    }

    return Promise.all(
      fluidTokenAddrs
        .map((addr) => tokens.find((t) => t.address === addr))
        .filter((t) => !!t && !!t.isFluidOf)
        .map(async (token) => {
          const baseToken = tokens.find((t) => t.address === token?.isFluidOf);

          if (!baseToken) return;

          const contract: ContractToken = {
            address: token?.address ?? "",
            ABI: tokenAbi,
            symbol: token?.symbol ?? "",
            isFluidOf: !!token?.isFluidOf,
          };

          return await manualRewardToken(
            contract,
            baseToken.symbol,
            userAddr,
            signer
          );
        })
    );
  };

  const addToken = async (symbol: string) => {
    const token = tokens.find((t) => t.symbol === symbol);

    if (!token) return;

    const { protocol, host } = window.location;

    const watchToken = {
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      image: `${protocol}//${host}${token.logo}`,
    };

    return connector?.watchAsset?.(watchToken);
  };

  const getPrizePool = async (): Promise<number> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return 0;
    }
    const rewardPoolAddr = "0xD3E24D732748288ad7e016f93B1dc4F909Af1ba0";

    return getTotalPrizePool(signer.provider, rewardPoolAddr, RewardPoolAbi);
  };

  const getFluidTokens = async (): Promise<string[]> => {
    const fluidTokenAddrs = tokens
      .filter((t) => !!t.isFluidOf)
      .map((t) => t.address);

    const fluidTokenBalances: [string, BN | undefined][] = await Promise.all(
      fluidTokenAddrs.map(async (addr) => [addr, await getBalance(addr)])
    );

    const ZERO = new BN(0);

    return fluidTokenBalances
      .filter((token) => token[1]?.gt(ZERO))
      .map(([addr]) => addr);
  };

  return (
    <FluidityFacadeContext.Provider
      value={{
        swap,
        limit,
        amountMinted,
        balance: getBalance,
        tokens: getFluidTokens,
        prizePool: getPrizePool,
        disconnect: deactivate,
        useConnectorType,
        rawAddress: account ?? "",
        address: account?.toLowerCase() ?? "",
        manualReward,
        addToken,
        connected: isActive,
      }}
    >
      {children}
    </FluidityFacadeContext.Provider>
  );
};

export const EthereumProvider = (rpcUrl: string, tokens: Token[]) => {
  const Provider = ({ children }: { children: React.ReactNode }) => {
    const connectors = useMemo(() => {
      const [particle, particleHooks] = initializeConnector<Particle>(
        (actions) => new Particle({
          actions,
          options: {
            projectId: 'de16eeaa-a811-4449-82c4-a876a8bdd323',
            clientKey: 'cGgPX2XGtmWIyc6GeK8XoxdH59BBRqbjKC946Aku',
            appId: '8f540914-5b47-4e10-aa6d-43004cd367c3',
          }
        })
      )

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

      const connectors: [any, Web3ReactHooks][] = [
        [metaMask, metamaskHooks],
        [walletConnect, walletconnectHooks],
        [particle, particleHooks],
      ];

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

  return Provider;
};

export default EthereumProvider;
