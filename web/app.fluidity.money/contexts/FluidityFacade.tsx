import { createContext } from "react";
import { TransactionResponse } from "~/util/chainUtils/instructions";

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
}

const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>({
  connected: false,
});

export default FluidityFacadeContext;
