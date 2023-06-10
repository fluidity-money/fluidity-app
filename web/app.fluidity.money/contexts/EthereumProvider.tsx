import type { ReactNode } from "react";
import type Result from "~/types/Result";
import type { Web3ReactHooks } from "@web3-react/core";
import type { Connector, Provider } from "@web3-react/types";
import type { TransactionResponse } from "~/util/chainUtils/instructions";
import type { Token } from "~/util/chainUtils/tokens";

import {
  confirmAccountOwnership_,
  signOwnerAddress_,
  StakingDepositsRes,
} from "~/util/chainUtils/ethereum/transaction";
import tokenAbi from "~/util/chainUtils/ethereum/Token.json";
import BN from "bn.js";
import { useMemo, useEffect, useContext } from "react";
import {
  useWeb3React,
  Web3ReactProvider,
  initializeConnector,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect-v2";
import { EIP1193 } from "@web3-react/eip1193";
import { SplitContext } from "contexts/SplitProvider";
import FluidityFacadeContext from "contexts/FluidityFacade";
import {
  manualRewardToken,
  getUserDegenScore,
  getUserStakingDeposits,
  getTokenStakingRatio,
  makeStakingDeposit,
  testMakeStakingDeposit,
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

import DegenScoreAbi from "~/util/chainUtils/ethereum/DegenScoreBeacon.json";
import StakingAbi from "~/util/chainUtils/ethereum/Staking.json";
import LootboxOwnershipAbi from "~/util/chainUtils/ethereum/LootboxConfirmAddressOwnership.json";
import { useToolTip } from "~/components";
import { NetworkTooltip } from "~/components/ToolTip";
import { Ok, Err } from "~/types/Result";

type MetamaskError = { code: number; message: string };

const EthereumFacade = ({
  children,
  tokens,
  connectors,
  network,
}: {
  children: ReactNode;
  tokens: Token[];
  connectors: Map<string, [Connector, Web3ReactHooks]>;
  network: Chain;
}) => {
  const { isActive, provider, account, connector, isActivating } =
    useWeb3React();

  const chain = chainType(network);
  const toolTip = useToolTip();

  if (!chain || chain !== "evm") console.warn("Unsupported connector", network);

  // attempt to connect eagerly on mount
  // https://github.com/Uniswap/web3-react/blob/main/packages/example-next/components/connectorCards/MetaMaskCard.tsx#L20
  useEffect(() => {
    Object.values(connectors).every(([connector]) => {
      connector
        ?.connectEagerly?.()
        ?.then(() => {
          // switch if connected eagerly to the wrong network
          // Provider type is missing chainId but it can exist
          const connectedChainId = (
            connector.provider as unknown as { chainId?: string }
          )?.chainId;

          const desiredChainId = `0x${getChainId(network).toString(16)}`;

          // If could not connect eagerly, continue to next provider
          if (!connectedChainId) return true;

          // If connected provider matches network, return
          if (desiredChainId === connectedChainId) return false;

          // Prompt switch chains modal
          connector
            .activate(getChainId(network))
            ?.catch((error: unknown | MetamaskError) => {
              // Filter for Metamask Error
              if (
                error &&
                Object.prototype.hasOwnProperty.call(error, "code")
              ) {
                const { code } = error as MetamaskError;

                const currNetwork = getNetworkFromChainId(connectedChainId);

                // Filter for Rejection code
                if (code === 4001 && currNetwork) {
                  toolTip.open("#010A16", <NetworkTooltip />);
                  const currPath = window.location.pathname.toLowerCase();

                  window.location.pathname = currPath.replaceAll(
                    network,
                    currNetwork
                  );
                }
              }

              return false;
            });
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
  ): Promise<Result<BN, Error>> => {
    const signer = provider?.getSigner();
    if (!signer) return Err(Error("no signer"));

    return getBalanceOfERC20(signer, contractAddress, tokenAbi);
  };

  const signBuffer = async (buffer: string): Promise<Result<string, Error>> => {
    const signer = provider?.getSigner();

    if (!signer) return Err(Error("no signer found"));

    return Ok(await signer.signMessage(buffer));
  };

  // find and activate corresponding connector
  const useConnectorType = async (
    type: "metamask" | "walletconnect" | "coin98" | "okxwallet" | string
  ): Promise<Result<void, Error>> => {
    const connector = connectors.get(type)?.[0];

    if (!connector) return Err(Error(`unsupported connector: ${type}`));

    return Ok(await connector.activate(getChainId(network)));
  };

  const deactivate = async (): Promise<Result<void, Error>> => {
    // Metamask does not directly disconnect, so instead reset State
    // https://github.com/Uniswap/web3-react/blob/main/packages/example-next/components/ConnectWithSelect.tsx#L139
    if (connector?.deactivate) {
      return Ok(await connector.deactivate());
    } else {
      return Ok(await connector.resetState());
    }
  };

  /**
   *
   * @deprecated mint limits no longer enabled
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const limit = async (contractAddress: string): Promise<Result<BN, Error>> => {
    return Err(Error("no longer enabled"));
  };

  /**
   *
   * @deprecated mint limits no longer enabled
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const amountMinted = async (
    contractAddress: string
  ): Promise<Result<BN, Error>> => {
    return Err(Error("no longer enabled"));
  };

  // swap <symbol> to its counterpart, with amount in its own units
  // e.g. swap $1.6 of USDC to fUSDC: swap("1600000", "USDC")
  const swap = async (
    amount: string,
    contractAddress: string
  ): Promise<Result<TransactionResponse, Error>> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(Error("no signer"));
    }

    const fromToken = tokens.find((t) => t.address === contractAddress);

    if (!fromToken) {
      return Err(Error("no fromToken"));
    }

    // true if swapping from fluid -> non-fluid
    const fromFluid = !!fromToken.isFluidOf;

    // if swapping from fluid, to its non-fluid counterpart
    // otherwise opposite
    const toToken = fromFluid
      ? tokens.find((t) => t.address === fromToken.isFluidOf)
      : tokens.find((t) => t.isFluidOf === fromToken.address);

    if (!toToken) {
      return Err(Error("no toToken"));
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

    const ethContractRes = Ok(await makeContractSwap(signer, from, to, amount));

    return ethContractRes.map(({ wait, hash }) => ({
      confirmTx: async () => (await wait()).status == 1,
      txHash: hash,
    }));
  };

  /**
   *
   * @deprecated manualReward no longer supported
   */
  const manualReward = async (
    fluidTokenAddrs: string[],
    userAddr: string
  ): Promise<
    Result<
      Result<{ gasFee: number; networkFee: number; amount: number }, Error>[],
      Error
    >
  > => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(Error("no signer"));
    }

    return Ok(
      await Promise.all(
        fluidTokenAddrs
          .map((addr) => tokens.find((t) => t.address === addr))
          .filter((t) => t && t.isFluidOf)
          .map(async (token, i) => {
            if (!token) return Err(Error(`no token at ${fluidTokenAddrs[i]}`));

            const baseToken = tokens.find(
              (t) => t.address === token?.isFluidOf
            );

            if (!baseToken)
              return Err(Error(`no matching base token for ${token.address}`));

            const contract: ContractToken = {
              address: token?.address ?? "",
              ABI: tokenAbi,
              symbol: token?.symbol ?? "",
              isFluidOf: !!token?.isFluidOf,
            };

            return Ok(
              await manualRewardToken(
                contract,
                baseToken.symbol,
                userAddr,
                signer
              )
            );
          })
      )
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

  // create a signature to say that `ownerAddress` owns the current address
  const signOwnerAddress = async (ownerAddress: string) => {
    const signer = provider?.getSigner();

    if (!signer) {
      return undefined;
    }

    const lootboxOwnershipAddr = "0x6a8AFEe01E95311F1372B34E686200068dbca1F2";
    try {
      const signature = await signOwnerAddress_(
        ownerAddress,
        signer,
        lootboxOwnershipAddr,
        LootboxOwnershipAbi
      );
      return signature;
    } catch (e) {
      console.log("failed to sign for account ownership", e);
    }
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

    const lootboxOwnershipAddr = "0x6a8AFEe01E95311F1372B34E686200068dbca1F2";
    try {
      const result = await confirmAccountOwnership_(
        signature,
        address,
        signer,
        lootboxOwnershipAddr,
        LootboxOwnershipAbi
      );
      console.log(result);
    } catch (e) {
      console.log("failed to confirm account ownership", e);
    }
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
        getStakingDeposits,
        stakeTokens,
        testStakeTokens,
        getStakingRatios,
        signOwnerAddress,
        confirmAccountOwnership,
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
    const connectors: Map<string, [Connector, Web3ReactHooks]> = useMemo(() => {
      const _connectors = new Map();

      const [metaMask, metamaskHooks] = initializeConnector<MetaMask>(
        (actions) => new MetaMask({ actions })
      );
      _connectors.set("metamask", [metaMask, metamaskHooks]);

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
      _connectors.set("walletconnect", [walletConnect, walletconnectHooks]);

      const [coin98, coin98Hooks] = initializeConnector<MetaMask>(
        (actions) => new MetaMask({ actions })
      );
      _connectors.set("coin98", [coin98, coin98Hooks]);

      if (okxWallet) {
        const [okx, okxHooks] = initializeConnector<EIP1193>(
          (actions) =>
            new EIP1193({
              actions,
              provider: okxWallet as Provider,
            })
        );
        _connectors.set("okx", [okx, okxHooks]);
      }

      return _connectors;
    }, [okxWallet]);

    return (
      <>
        <Web3ReactProvider connectors={Object.values(connectors)}>
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
