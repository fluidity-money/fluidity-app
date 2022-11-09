import { createContext } from "react";

export interface IFluidityFacade {
  swap: (
    amount: string,
    tokenAddr: string,
  ) => Promise<void>;
  limit: () => Promise<number>;
  balance: (tokenAddr: string) => Promise<string>;
  disconnect: () => Promise<void>;

  connected: boolean;
  useConnectorType: (use: string) => void;

  address: string;
}

const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>({
  connected: false,
});

export default FluidityFacadeContext;
