import { ReactNode, useContext } from "react";
import type { Web3ReactHooks } from "@web3-react/core";
import type { Connector, Provider } from "@web3-react/types";
import type { TransactionResponse } from "~/util/chainUtils/instructions";
import type { Token } from "~/util/chainUtils/tokens";

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
import { EIP1193 } from "@web3-react/eip1193";
import { SplitContext } from "contexts/SplitProvider";
import FluidityFacadeContext from "contexts/FluidityFacade";
import {
  getUserMintLimit,
  userMintLimitEnabled,
  manualRewardToken,
  getUserDegenScore,
} from "~/util/chainUtils/ethereum/transaction";
import makeContractSwap, {
  ContractToken,
  getAmountMinted,
  getBalanceOfERC20,
} from "~/util/chainUtils/ethereum/transaction";
import { Buffer } from "buffer";
import useWindow from "~/hooks/useWindow";
import {
  Chain,
  chainType,
  getChainId,
  getNetworkFromChainId,
} from "~/util/chainUtils/chains";

import DegenScoreAbi from "~/util/chainUtils/ethereum/DegenScoreBeacon.json";
import { useToolTip } from "~/components";
import { NetworkTooltip } from "~/components/ToolTip";

type OKXWallet = {
  isOkxWallet: boolean;
} & Provider;

type Coin98Wallet = {
  isCoin98?: boolean;
} & Provider;

type MetamaskError = { code: number; message: string };

const EthereumFacade = ({
  children,
  tokens,
  connectors,
  network,
}: {
  children: ReactNode;
  tokens: Token[];
  connectors: [Connector, Web3ReactHooks][];
  network: Chain;
}) => {
  const { isActive, provider, account, connector, isActivating } =
    useWeb3React();
  const okxWallet = useWindow("okxwallet");
  const browserWallet = useWindow("ethereum") as Coin98Wallet;

  const chain = chainType(network);
  const toolTip = useToolTip();

  if (!chain || chain !== "evm") console.warn("Unsupported connector", network);

  // attempt to connect eagerly on mount
  // https://github.com/Uniswap/web3-react/blob/main/packages/example-next/components/connectorCards/MetaMaskCard.tsx#L20
  useEffect(() => {
    connectors.every(([connector]) => {
      connector
        ?.connectEagerly?.()
        ?.then(() => {
          // switch if connected eagerly to the wrong network
          // Provider type is missing chainId but it can exist
          const connectedChainId = (
            connector.provider as unknown as { chainId?: string }
          )?.chainId;
          const desiredChainId = `0x${getChainId(network).toString(16)}`;
          if (connectedChainId && desiredChainId !== connectedChainId) {
            connector
              .activate(getChainId(network))
              ?.catch((error: unknown | MetamaskError) => {
                if (
                  error &&
                  Object.prototype.hasOwnProperty.call(error, "code")
                ) {
                  const { code } = error as MetamaskError;
                  if (code === 4001) {
                    toolTip.open("#010A16", <NetworkTooltip />);
                    const currPath = window.location.pathname.toLowerCase();
                    const currNetwork = getNetworkFromChainId(connectedChainId);

                    if (currNetwork) {
                      window.location.pathname = currPath.replaceAll(
                        network,
                        currNetwork
                      );
                    }
                  }
                }
                return false;
              });
          }
        })
        .catch(() => true);
    });
  }, []);

  const { setSplitUser } = useContext(SplitContext);

  useEffect(() => {
    if (!account) return;

    setSplitUser(account);
  }, [account]);

  const getBalance = async (
    contractAddress: string
  ): Promise<BN | undefined> => {
    const signer = provider?.getSigner();
    if (!signer) {
      return;
    }

    return await getBalanceOfERC20(signer, contractAddress, tokenAbi);
  };

  const signBuffer = async (buffer: string): Promise<string | undefined> => {
    const signer = provider?.getSigner();

    if (!signer) return;

    return signer.signMessage(buffer);
  };

  // find and activate corresponding connector
  const useConnectorType = (
    type: "metamask" | "walletconnect" | "coin98" | "okxwallet" | string
  ) => {
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
        // Node Polyfills are no longer bundled with webpack
        // We manually re-add Node.Buffer to client
        // https://github.com/WalletConnect/web3modal/issues/455
        window.Buffer = Buffer;
        break;
      case "okxwallet":
        !okxWallet && window?.open("https://www.okx.com/web3", "_blank");

        connector = connectors.find((connector) => {
          const _connector = (connector[0].provider as OKXWallet)?.isOkxWallet
            ? connector[0]
            : undefined;
          return _connector;
        })?.[0];
        break;
      case "coin98":
        (!browserWallet || !browserWallet.isCoin98) &&
          window?.open("https://wallet.coin98.com/", "_blank");

        connector = connectors.find((connector) => {
          const _connector = (connector[0].provider as Coin98Wallet)?.isCoin98
            ? connector[0]
            : undefined;
          return _connector;
        })?.[0];
        break;
      default:
        console.warn("Unsupported connector", type);
        break;
    }

    connector?.activate(getChainId(network));
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

  /**
   * addToken attempts to watch asset.
   *
   * Will fail on non-Metamask compliant wallets.
   */
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

  // getFluidTokens returns FLUID tokens user holds.
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

  /**
   * getDegenScore returns the "DegenScore" of a user.
   *
   * Source: https://degenscore.com.
   */
  const getDegenScore = async (address: string): Promise<number> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return 0;
    }

    const degenScoreAddr = "0x0521FA0bf785AE9759C7cB3CBE7512EbF20Fbdaa";

    return getUserDegenScore(
      signer.provider,
      address,
      degenScoreAddr,
      DegenScoreAbi
    );
  };

  return (
    <FluidityFacadeContext.Provider
      value={{
        swap,
        limit,
        amountMinted,
        balance: getBalance,
        tokens: getFluidTokens,
        disconnect: deactivate,
        useConnectorType,
        rawAddress: account ?? "",
        address: account?.toLowerCase() ?? "",
        manualReward,
        getDegenScore,
        addToken,
        connected: isActive,
        connecting: isActivating,
        signBuffer,
      }}
    >
      {children}
    </FluidityFacadeContext.Provider>
  );
};

export const EthereumProvider = (
  rpcUrl: string,
  tokens: Token[],
  network?: string
) => {
  if (!network) throw new Error("No network provided to EthereumProvider!");

  const Provider = ({ children }: { children: React.ReactNode }) => {
    // Custom key logic
    const okxWallet = useWindow("okxwallet");

    // Listen for changes to the injected connectors / Setup the injected connectors.
    const [connectors, key]: [[Connector, Web3ReactHooks][], string] =
      useMemo(() => {
        const _key: string[] = [];
        const _connectors: [Connector, Web3ReactHooks][] = [];
        const [metaMask, metamaskHooks] = initializeConnector<MetaMask>(
          (actions) => new MetaMask({ actions })
        );
        _connectors.push([metaMask, metamaskHooks]);
        _key.push("MetaMask");

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
        _connectors.push([walletConnect, walletconnectHooks]);
        _key.push("WalletConnect");

        const [coin98, coin98Hooks] = initializeConnector<MetaMask>(
          (actions) => new MetaMask({ actions })
        );
        _connectors.push([coin98, coin98Hooks]);
        _key.push("Coin98");

        if (okxWallet) {
          const [okx, okxHooks] = initializeConnector<EIP1193>(
            (actions) =>
              new EIP1193({
                actions,
                provider: okxWallet as Provider,
              })
          );
          _connectors.push([okx, okxHooks]);
          _key.push("OKX");
        }

        return [_connectors, _key.join(",")];
      }, [okxWallet]);
    return (
      <>
        <Web3ReactProvider connectors={connectors} key={key}>
          <EthereumFacade
            tokens={tokens}
            connectors={connectors}
            network={network as Chain}
          >
            {children}
          </EthereumFacade>
        </Web3ReactProvider>
      </>
    );
  };

  return Provider;
};

export default EthereumProvider;
