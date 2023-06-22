import type Result from "~/types/Result";
import type { TransactionResponse } from "~/util/chainUtils/instructions";
import type {
  StakingRatioRes,
  StakingDepositsRes,
  StakingRedeemableRes,
} from "~/util/chainUtils/ethereum/transaction";

import type BN from "bn.js";

import { createContext } from "react";

export interface IFluidityFacade {
  swap: (
    amount: string,
    tokenAddr: string
  ) => Promise<Result<TransactionResponse, Error>>;
  limit: (tokenAddr: string) => Promise<Result<BN, Error>>;
  amountMinted: (tokenAddr: string) => Promise<Result<BN, Error>>;
  balance: (tokenAddr: string) => Promise<Result<BN, Error>>;
  disconnect: () => Promise<Result<void, Error>>;
  tokens: () => Promise<Result<string, Error>[]>;
  signBuffer?: (buffer: string) => Promise<Result<string, Error>>;

  connected: boolean;
  connecting: boolean;
  useConnectorType: (use: string) => Promise<Result<void, Error>>;

  // Normalised address - For filtering, etc
  address: string;

  // Raw address - For UI
  rawAddress: string;

  // Ethereum only
  manualReward?: (
    fluidTokenAddrs: string[],
    userAddr: string
  ) => Promise<
    Result<{ gasFee: number; networkFee: number; amount: number }[], Error>
  >;

  getDegenScore?: (address: string) => Promise<Result<number, Error>>;

  addToken?: (symbol: string) => Promise<Result<boolean, Error>>;

  getStakingRatios?: () => Promise<Result<StakingRatioRes, Error>>;

  getStakingDeposits?: (address: string) => Promise<
    Result<
      {
        fluidAmount: BN;
        baseAmount: BN;
        durationDays: number;
        depositDate: Date;
      }[],
      Error
    >
  >;

  testStakeTokens?: (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdcAmt: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ) => Promise<Result<StakingDepositsRes, Error>>;

  stakeTokens?: (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdcAmt: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ) => Promise<Result<TransactionResponse, Error>>;

  signOwnerAddress?: (ownerAddress: string) => Promise<Result<string, Error>>;

  redeemTokens?: () => Promise<Result<TransactionResponse, Error>>;

  redeemableTokens?: (
    address: string
  ) => Promise<Result<StakingRedeemableRes, Error>>;

  confirmAccountOwnership?: (
    signature: string,
    address: string
  ) => Promise<Result<TransactionResponse, Error>>;
}

const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>({
  connected: false,
});

export default FluidityFacadeContext;
