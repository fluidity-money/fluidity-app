import { createContext } from "react";

export interface IFluidityFacade {
  limit: (tokenAddr: string) => Promise<number | undefined>;
  amountMinted: (tokenAddr: string) => Promise<number | undefined>;
  balance: (tokenAddr: string) => Promise<number>;
  disconnect: () => Promise<void>;

  connected: boolean;
  connecting: boolean;
  useConnectorType: (use: string) => void;

  address: string;
  
  // Ethereum Only
  ethSwap: (amount: string, tokenAddr: string) => Promise<void>;
}

const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>({
  connected: false,
});

export default FluidityFacadeContext;
