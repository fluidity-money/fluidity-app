import { createContext } from "react";

export interface IFluidityFacade {
  swap: (amount: string, tokenAddr: string) => Promise<void>;
  limit: (tokenAddr: string) => Promise<number>;
  balance: (tokenAddr: string) => Promise<number>;
  disconnect: () => Promise<void>;

  connected: boolean;
	connecting: boolean;
  useConnectorType: (use: string) => void;

  address: string;
}

const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>({
  connected: false,
});

export default FluidityFacadeContext;
