import type { TransactionResponse } from "~/util/chainUtils/instructions";
import type {
  StakingRatioRes,
  StakingDepositsRes,
} from "~/util/chainUtils/ethereum/transaction";

import type BN from "bn.js";

import { createContext } from "react";

export interface IFluidityFacade {
  swap: (
    amount: string,
    tokenAddr: string
  ) => Promise<TransactionResponse | undefined>;
  limit: (tokenAddr: string) => Promise<BN | undefined>;
  amountMinted: (tokenAddr: string) => Promise<BN | undefined>;
  balance: (tokenAddr: string) => Promise<BN | undefined>;
  disconnect: () => Promise<void>;
  tokens: () => Promise<string[]>;
  signBuffer?: (buffer: string) => Promise<string | undefined>;

  connected: boolean;
  connecting: boolean;
  useConnectorType: (use: string) => void;

  // Normalised address - For filtering, etc
  address: string;

  // Raw address - For UI
  rawAddress: string;

  // Ethereum only
  manualReward?: (
    fluidTokenAddrs: string[],
    userAddr: string
  ) => Promise<
    | ({ gasFee: number; networkFee: number; amount: number } | undefined)[]
    | undefined
  >;

  getDegenScore?: (address: string) => Promise<number>;

  addToken?: (symbol: string) => Promise<boolean | undefined>;

  getStakingRatios?: () => Promise<StakingRatioRes | undefined>;

  getStakingDeposits?: (address: string) => Promise<
    | Array<{
        fluidAmount: BN;
        baseAmount: BN;
        durationDays: number;
        depositDate: Date;
      }>
    | undefined
  >;

  testStakeTokens?: (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdcAmt: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ) => Promise<StakingDepositsRes | undefined>;

  stakeTokens?: (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdcAmt: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ) => Promise<TransactionResponse | undefined>;
  
  signOwnerAddress?: (
    ownerAddress: string
  ) => Promise<string | undefined>

  confirmAccountOwnership?: (
    signature: string,
    address: string,
  ) => Promise<void>
}

const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>({
  connected: false,
});

export default FluidityFacadeContext;
