import { createContext } from "react";
import type { TransactionResponse } from "~/util/chainUtils/instructions";

export interface IFluidityFacade {
  swap: (
    amount: string,
    tokenAddr: string
  ) => Promise<TransactionResponse | undefined>;
  limit: (tokenAddr: string) => Promise<number | undefined>;
  amountMinted: (tokenAddr: string) => Promise<number | undefined>;
  balance: (tokenAddr: string) => Promise<number>;
  disconnect: () => Promise<void>;
  prizePool: () => Promise<number>;

  connected: boolean;
  connecting: boolean;
  useConnectorType: (use: string) => void;

  // Normalised address - For filtering, etc
  address: string;

  // Raw address - For UI
  rawAddress: string;

  // Ethereum only
  manualReward: (
    fluidTokenAddrs: string[],
    userAddr: string
  ) => Promise<
    | ({ gasFee: number; networkFee: number; amount: number } | undefined)[]
    | undefined
  >;
  
  addToken: (symbol: string) => Promise<boolean | undefined>
}

const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>({
  connected: false,
});

export default FluidityFacadeContext;
