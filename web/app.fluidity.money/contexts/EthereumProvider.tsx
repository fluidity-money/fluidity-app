import type { ReactNode } from "react";
import {
  confirmAccountOwnership_,
  signOwnerAddress_,
  StakingDepositsRes,
} from "~/util/chainUtils/ethereum/transaction";
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
import { WalletConnect } from "@web3-react/walletconnect-v2";
import { EIP1193 } from "@web3-react/eip1193";
import FluidityFacadeContext from "contexts/FluidityFacade";
import {
  getUserStakingDeposits,
  getTokenStakingRatio,
  makeStakingDeposit,
  testMakeStakingDeposit,
  makeStakingRedemption,
} from "~/util/chainUtils/ethereum/transaction";
import {
  merkleDistributorWithDeadlineClaim as doMerkleDistributorWithDeadlineClaim,
  merkleDistributorWithDeadlineClaimAndStake as doMerkleDistributorWithDeadlineClaimAndStake,
  flyStakingStake as doFlyStakingStake,
  flyStakingBeginUnstake as doFlyStakingBeginUnstake,
  flyStakingDetails as doFlyStakingDetails,
  flyStakingAmountUnstaking as doFlyStakingAmountUnstaking,
  flyStakingFinaliseUnstake as doFlyStakingFinaliseUnstake,
  flyStakingSecondsUntilSoonestUnstake as doFlyStakingSecondsUntilSoonestUnstake,
} from "~/util/chainUtils/ethereum/transaction";
import makeContractSwap, {
  ContractToken,
  getBalanceOfERC20,
} from "~/util/chainUtils/ethereum/transaction";
import useWindow from "~/hooks/useWindow";
import {
  Chain,
  chainType,
  getChainId,
  getNetworkFromChainId,
} from "~/util/chainUtils/chains";

import TokenAbi from "~/util/chainUtils/ethereum/Token.json";
import StakingAbi from "~/util/chainUtils/ethereum/Staking.json";
import LootboxOwnershipAbi from "~/util/chainUtils/ethereum/LootboxConfirmAddressOwnership.json";
import MerkleDistributorWithDeadlineAbi from "~/util/chainUtils/ethereum/MerkleDistributorWithDeadline.json";
import FlyStakingAbi from "~/util/chainUtils/ethereum/FLYStaking.json";

import { useToolTip } from "~/components";
import { NetworkTooltip } from "~/components/ToolTip";

const FlyTokenAddr = "0x000F1720A263f96532D1ac2bb9CDC12b72C6f386";

const FlyStakingAddr = "0x9E8892E443AD6472e4D9362DF6D0C238000028a3";

const MerkleDistributorWithDeadlineAddr = "0xa86fe32da288f169c2ee449b585dcb0317b631e1";

type OKXWallet = {
  isOkxWallet: boolean;
} & Provider;

type Coin98Wallet = {
  isCoin98?: boolean;
} & Provider;

type MetamaskError = { code: number; message: string };

// FLY is a special case that shouldn't be defined in the normal tokens list
export const FlyToken = {
  symbol: "FLY",
  logo: "https://static.fluidity.money/images/fly.svg",
  address: "0x000F1720A263f96532D1ac2bb9CDC12b72C6f386",
  decimals: 6,
  // mock these fields as we don't need them to add the token to wallet or fetch its balance
  colour: "",
  enabled: true,
  name: ""
} satisfies Token

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

  /**
   *
   * @deprecated mint limits no longer enabled
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const limit = async (contractAddress: string): Promise<BN | undefined> => {
    return undefined;
  };

  /**
   *
   * @deprecated mint limits no longer enabled
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const amountMinted = async (contractAddress: string): Promise<BN> => {
    return new BN(0);
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

  /**
   *
   * @deprecated manual reward no longer supported
   */
  const manualReward = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fluidTokenAddrs: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userAddr: string
  ): Promise<
    | ({ amount: number; gasFee: number; networkFee: number } | undefined)[]
    | undefined
  > => {
    return undefined;
  };

  /**
   * addToken attempts to watch asset.
   *
   * Will fail on non-Metamask compliant wallets.
   */
  const addToken = async (symbol: string) => {
    const token = symbol === "FLY" ?
      FlyToken :
      tokens.find((t) => t.symbol === symbol);

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
   * getStakingDeposits returns total tokens staked by a user.
   */
  const getStakingDeposits = async (
    address: string
  ): Promise<
    | Array<{
      fluidAmount: BN;
      baseAmount: BN;
      durationDays: number;
      depositDate: Date;
    }>
    | undefined
  > => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const stakingAddr = "0x770f77A67d9B1fC26B80447c666f8a9aECA47C82";

    const stakingDeposits =
      (await getUserStakingDeposits(
        signer.provider,
        StakingAbi,
        stakingAddr,
        address
      )) ?? [];

    return stakingDeposits.map(
      ({
        redeemTimestamp,
        depositTimestamp,
        camelotTokenA,
        sushiswapTokenA,
        camelotTokenB,
        sushiswapTokenB,
      }) => {
        const fluidAmount = new BN(
          camelotTokenA.add(sushiswapTokenA).toString()
        );

        const baseAmount = new BN(
          camelotTokenB.add(sushiswapTokenB).toString()
        );

        return {
          fluidAmount,
          baseAmount,
          durationDays:
            (redeemTimestamp.toNumber() - depositTimestamp.toNumber()) /
            24 /
            60 /
            60,
          depositDate: new Date(depositTimestamp.toNumber() * 1000),
        };
      }
    );
  };

  const getStakingRatios = async () => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const stakingAddr = "0x770f77A67d9B1fC26B80447c666f8a9aECA47C82";

    return getTokenStakingRatio(signer.provider, StakingAbi, stakingAddr);
  };

  /*
   * testStakeTokens returns total tokens staked by a user.
   */
  const testStakeTokens = async (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdcAmt: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ): Promise<StakingDepositsRes | undefined> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const stakingAddr = "0x770f77A67d9B1fC26B80447c666f8a9aECA47C82";

    return testMakeStakingDeposit(
      signer,
      StakingAbi,
      stakingAddr,
      lockDurationSeconds,
      usdcAmt,
      fusdcAmt,
      wethAmt,
      slippage,
      maxTimestamp
    );
  };

  /*
   * stakeTokens locks up user tokens.
   */
  const stakeTokens = async (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdcAmt: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ): Promise<TransactionResponse | undefined> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const stakingAddr = "0x770f77A67d9B1fC26B80447c666f8a9aECA47C82";

    const [usdcToken, fusdcToken, wethToken] = ["USDC", "fUSDC", "wETH"].map(
      (tokenSymbol) => {
        const token = tokens.find(({ symbol }) => symbol === tokenSymbol);

        if (!token) throw Error(`Could not find token ${tokenSymbol}`);

        const tokenContract: ContractToken = {
          address: token.address,
          ABI: tokenAbi,
          symbol: tokenSymbol,
          isFluidOf: !!token.isFluidOf,
        };

        return tokenContract;
      }
    );

    const stakingDepositRes = await makeStakingDeposit(
      signer,
      usdcToken,
      fusdcToken,
      wethToken,
      StakingAbi,
      stakingAddr,
      lockDurationSeconds,
      usdcAmt,
      fusdcAmt,
      wethAmt,
      slippage,
      maxTimestamp
    );

    return stakingDepositRes
      ? {
        confirmTx: async () => (await stakingDepositRes.wait())?.status === 1,
        txHash: stakingDepositRes.hash,
      }
      : undefined;
  };

  /*
   * @deprecated
   * redeemableTokens gets amount of staked tokens after lockup period
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const redeemableTokens = async (address: string) => {
    return undefined;
  };

  /*
   * redeemTokens redeems all staked tokens after lockup period
   */
  const redeemTokens = async (): Promise<TransactionResponse | undefined> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const stakingAddr = "0x770f77A67d9B1fC26B80447c666f8a9aECA47C82";

    const maxTimestamp = new BN(0);

    const minimumTokenAmt = new BN(0);

    const stakingRedeemRes = await makeStakingRedemption(
      signer,
      StakingAbi,
      stakingAddr,
      maxTimestamp,
      minimumTokenAmt,
      minimumTokenAmt,
      minimumTokenAmt
    );

    return stakingRedeemRes
      ? {
        confirmTx: async () => (await stakingRedeemRes.wait())?.status === 1,
        txHash: stakingRedeemRes.hash,
      }
      : undefined;
  };

  // create a signature to say that `ownerAddress` owns the current address
  const signOwnerAddress = async (ownerAddress: string) => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const lootboxOwnershipAddr = "0x18eb6ac990bd3a31dd3e5dd9c7744751c8e9dc06";
    const signature = await signOwnerAddress_(
      ownerAddress,
      signer,
      lootboxOwnershipAddr,
      LootboxOwnershipAbi
    );
    return signature;
  };

  // `confirm` that an account is owned by this account using a signature they have created
  const confirmAccountOwnership = async (
    signature: string,
    address: string
  ) => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const lootboxOwnershipAddr = "0x18eb6ac990bd3a31dd3e5dd9c7744751c8e9dc06";
    const result = await confirmAccountOwnership_(
      signature,
      address,
      signer,
      lootboxOwnershipAddr,
      LootboxOwnershipAbi
    );
    console.log(result);
  };

  const merkleDistributorWithDeadlineEndTime = () => {
    throw new Error("TODO");
  };

  const merkleDistributorWithDeadlineClaim = async (
    address: string,
    index: number,
    amount: BN,
    merkleProof: string[]
  ) => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const result = await doMerkleDistributorWithDeadlineClaim(
      signer,
      MerkleDistributorWithDeadlineAddr,
      MerkleDistributorWithDeadlineAbi,
      index,
      amount,
      merkleProof
    );
    console.log(result);

    return true;
  };

  const merkleDistributorWithDeadlineClaimAndStake = async (
    address: string,
    index: number,
    amount: BN,
    merkleProof: string[]
  ) => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const result = await doMerkleDistributorWithDeadlineClaimAndStake(
      signer,
      MerkleDistributorWithDeadlineAddr,
      MerkleDistributorWithDeadlineAbi,
      index,
      amount,
      merkleProof
    );
    console.log(result);
  };

  const flyStakingStake = async (amount: BN) => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const result = await doFlyStakingStake(
      signer,
      FlyTokenAddr,
      TokenAbi,
      FlyStakingAddr,
      FlyStakingAbi,
      amount,
    );
    console.log(result);

    return new BN(result.toString());
  };

  const flyStakingDetails = async (address: string) => {
    if (!provider) return undefined;

    const result = await doFlyStakingDetails(
      provider,
      FlyStakingAddr,
      FlyStakingAbi,
      address
    );
    console.log(result);

    return result;
  };

  const flyStakingSecondsUntilSoonestUnstake = async (address: string) => {
    if (!provider) return undefined;

    const result = await doFlyStakingSecondsUntilSoonestUnstake(
      provider,
      FlyStakingAddr,
      FlyStakingAbi,
      address
    );
    console.log(result);

    if (!result) {
      return undefined;
    }

    return new BN(result.toString());
  };

  const flyStakingBeginUnstake = async (amount: BN) => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const result = await doFlyStakingBeginUnstake(
      signer,
      FlyStakingAddr,
      FlyStakingAbi,
      amount
    );
    console.log(result);

    if (!result) {
      return undefined;
    }

    return result;
  };

  const flyStakingFinaliseUnstake = async () => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const result = await doFlyStakingFinaliseUnstake(
      signer,
      FlyStakingAddr,
      FlyStakingAbi
    );
    console.log(result);

    if (!result) {
      return undefined;
    }

    return new BN(result.toString());
  };

  const flyStakingAmountUnstaking = async (address: string) => {
    if (!provider) return undefined;

    const result = await doFlyStakingAmountUnstaking(
      provider,
      FlyStakingAddr,
      FlyStakingAbi,
      address
    );
    console.log(result);

    if (!result) return;

    return new BN(result.toString());
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
        addToken,
        connected: isActive,
        connecting: isActivating,
        signBuffer,
        getStakingDeposits,
        stakeTokens,
        redeemableTokens,
        redeemTokens,
        testStakeTokens,
        getStakingRatios,
        signOwnerAddress,
        confirmAccountOwnership,
        merkleDistributorWithDeadlineEndTime,
        merkleDistributorWithDeadlineClaim,
        merkleDistributorWithDeadlineClaimAndStake,
        flyStakingStake,
        flyStakingDetails,
        flyStakingBeginUnstake,
        flyStakingSecondsUntilSoonestUnstake,
        flyStakingFinaliseUnstake,
        flyStakingAmountUnstaking,
      }}
    >
      {children}
    </FluidityFacadeContext.Provider>
  );
};

export const EthereumProvider = (
  walletconnectId: string,
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
                  projectId: walletconnectId,
                  chains: [1, 42161],
                  showQrModal: true,
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
