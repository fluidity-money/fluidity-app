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
  StakingRatioRes,
  StakingRedeemableRes,
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
  getUserDegenScore,
  getUserStakingDeposits,
  getTokenStakingRatio,
  makeStakingDeposit,
  testMakeStakingDeposit,
  makeStakingRedemption,
  getRedeemableTokens,
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
import { ContractTransaction } from "ethers";

type MetamaskError = { code: number; message: string };

const EthereumFacade = ({
  children,
  tokens,
  connectors,
  network,
}: {
  children: ReactNode;
  tokens: Token[];
  connectors: { [providerId: string]: [Connector, Web3ReactHooks] };
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
    const connector = connectors[type]?.[0];

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
   * @deprecated manual reward no longer enabled
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const manualReward = async (
    fluidTokenAddrs: string[],
    userAddr: string
  ): Promise<
    Result<{ gasFee: number; networkFee: number; amount: number }[], Error>
  > => {
    return Err(Error("no longer enabled"));
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
      return Err(new Error("no signer"));
    }

    const fromToken = tokens.find((t) => t.address === contractAddress);

    if (!fromToken) {
      return Err(new Error("no fromToken"));
    }

    // true if swapping from fluid -> non-fluid
    const fromFluid = !!fromToken.isFluidOf;

    // if swapping from fluid, to its non-fluid counterpart
    // otherwise opposite
    const toToken = fromFluid
      ? tokens.find((t) => t.address === fromToken.isFluidOf)
      : tokens.find((t) => t.isFluidOf === fromToken.address);

    if (!toToken) {
      return Err(new Error("no toToken"));
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

    return ethContractRes.map((ethContract: ContractTransaction) => ({
      confirmTx: async () => (await ethContract.wait()).status == 1,
      txHash: ethContract.hash,
    }));
  };

  /**
   * addToken attempts to watch asset.
   *
   * Will fail on non-Metamask compliant wallets.
   */
  const addToken = async (symbol: string): Promise<Result<boolean, Error>> => {
    const token = tokens.find((t) => t.symbol === symbol);

    if (!token) return Err(new Error("Could not find matching token"));

    const { protocol, host } = window.location;

    const watchToken = {
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      image: `${protocol}//${host}${token.logo}`,
    };

    return Ok(await connector?.watchAsset?.(watchToken)).flatMap((success) =>
      success === true ? Ok(success) : Err(Error("Could not watch token"))
    );
  };

  // getFluidTokens returns FLUID tokens user holds.
  const getFluidTokens = async (): Promise<Result<string, Error>[]> => {
    const fluidTokenAddrs = tokens
      .filter((t) => !!t.isFluidOf)
      .map((t) => t.address);

    const fluidTokenBalances: [string, Result<BN, Error>][] = await Promise.all(
      fluidTokenAddrs.map(async (addr) => [addr, await getBalance(addr)])
    );

    const ZERO = new BN(0);

    return fluidTokenBalances.map(([addr, balance]) =>
      balance.flatMap((balance) =>
        balance.gt(ZERO) ? Ok(addr) : Err(new Error("No tokens"))
      )
    );
  };

  /**
   * getDegenScore returns the "DegenScore" of a user.
   *
   * Source: https://degenscore.com.
   */
  const getDegenScore = async (
    address: string
  ): Promise<Result<number, Error>> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(new Error("No signer found"));
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
    Result<
      {
        fluidAmount: BN;
        baseAmount: BN;
        durationDays: number;
        depositDate: Date;
      }[],
      Error
    >
  > => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(new Error("No signer found"));
    }

    const stakingAddr = "0x770f77A67d9B1fC26B80447c666f8a9aECA47C82";

    const stakingDepositsRes = await getUserStakingDeposits(
      signer.provider,
      StakingAbi,
      stakingAddr,
      address
    );

    return stakingDepositsRes.map((stakingDeposits) =>
      stakingDeposits.map((stakingDeposit) => {
        const {
          redeemTimestamp,
          depositTimestamp,
          camelotTokenA,
          sushiswapTokenA,
          camelotTokenB,
          sushiswapTokenB,
        } = stakingDeposit;

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
      })
    );
  };

  const getStakingRatios = async (): Promise<
    Result<StakingRatioRes, Error>
  > => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(new Error("Could not find signer"));
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
  ): Promise<Result<StakingDepositsRes, Error>> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(new Error("Could not find signer"));
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
  ): Promise<Result<TransactionResponse, Error>> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(new Error("Could not find signer"));
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

    return (
      await makeStakingDeposit(
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
      )
    ).map((stakingDepositRes: ContractTransaction) => ({
      confirmTx: async () => (await stakingDepositRes.wait())?.status === 1,
      txHash: stakingDepositRes.hash,
    }));
  };

  /*
   * redeemableTokens gets amount of staked tokens after lockup period
   */
  const redeemableTokens = async (
    address: string
  ): Promise<Result<StakingRedeemableRes, Error>> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(new Error("Could not find signer"));
    }

    const stakingAddr = "0x770f77A67d9B1fC26B80447c666f8a9aECA47C82";

    const redeemableTokensRes = await getRedeemableTokens(
      signer,
      StakingAbi,
      stakingAddr,
      address
    );

    return redeemableTokensRes.map((tokens) => {
      const { fusdcRedeemable, usdcRedeemable, wethRedeemable } = tokens;

      return {
        fusdcRedeemable: new BN(fusdcRedeemable.toString()),
        usdcRedeemable: new BN(usdcRedeemable.toString()),
        wethRedeemable: new BN(wethRedeemable.toString()),
      };
    });
  };

  /*
   * redeemTokens redeems all staked tokens after lockup period
   */
  const redeemTokens = async (): Promise<
    Result<TransactionResponse, Error>
  > => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(new Error("Could not find signer"));
    }

    const stakingAddr = "0x770f77A67d9B1fC26B80447c666f8a9aECA47C82";

    const now = new BN(Math.floor(Date.now() / 1000));

    const minimumTokenAmt = new BN(0);

    const stakingRedeemRes = await makeStakingRedemption(
      signer,
      StakingAbi,
      stakingAddr,
      now,
      minimumTokenAmt,
      minimumTokenAmt,
      minimumTokenAmt
    );

    return stakingRedeemRes.map((stakingRedeem: ContractTransaction) => ({
      confirmTx: async () => (await stakingRedeem.wait()).status == 1,
      txHash: stakingRedeem.hash,
    }));
  };

  // create a signature to say that `ownerAddress` owns the current address
  const signOwnerAddress = async (
    ownerAddress: string
  ): Promise<Result<string, Error>> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(new Error("Could not find signer"));
    }

    const lootboxOwnershipAddr = "0x18eb6ac990bd3a31dd3e5dd9c7744751c8e9dc06";
    return signOwnerAddress_(
      ownerAddress,
      signer,
      lootboxOwnershipAddr,
      LootboxOwnershipAbi
    );
  };

  // `confirm` that an account is owned by this account using a signature they have created
  const confirmAccountOwnership = async (
    signature: string,
    address: string
  ): Promise<Result<TransactionResponse, Error>> => {
    const signer = provider?.getSigner();

    if (!signer) {
      return Err(new Error("Could not find signer"));
    }

    const lootboxOwnershipAddr = "0x18eb6ac990bd3a31dd3e5dd9c7744751c8e9dc06";
    const confirmAccountRes = await confirmAccountOwnership_(
      signature,
      address,
      signer,
      lootboxOwnershipAddr,
      LootboxOwnershipAbi
    );

    return confirmAccountRes.map((confirmAccount: ContractTransaction) => ({
      confirmTx: async () => (await confirmAccount.wait()).status == 1,
      txHash: confirmAccount.hash,
    }));
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
        redeemableTokens,
        redeemTokens,
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
    const connectors: { [providerId: string]: [Connector, Web3ReactHooks] } =
      useMemo(() => {
        const _connectors = {} as {
          [providerId: string]: [Connector, Web3ReactHooks];
        };

        const [metaMask, metamaskHooks] = initializeConnector<MetaMask>(
          (actions) => new MetaMask({ actions })
        );
        _connectors["metamask"] = [metaMask, metamaskHooks];

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
        _connectors["walletconnect"] = [walletConnect, walletconnectHooks];

        const [coin98, coin98Hooks] = initializeConnector<MetaMask>(
          (actions) => new MetaMask({ actions })
        );
        _connectors["coin98"] = [coin98, coin98Hooks];

        if (okxWallet) {
          const [okx, okxHooks] = initializeConnector<EIP1193>(
            (actions) =>
              new EIP1193({
                actions,
                provider: okxWallet as Provider,
              })
          );
          _connectors["okx"] = [okx, okxHooks];
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
