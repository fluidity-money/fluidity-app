import { createContext } from "react";

interface IFluidityFacade {
  // swap token to its fluid or non-fluid counterpart by symbol
  swap: (amount: string, token: string) => Promise<void>;
  limit: (token: string) => Promise<number>;
  balance: (token: string) => Promise<number>;
  disconnect: () => Promise<void>;

  connected: boolean;
  useConnectorType: (use: string) => void;

  address: string;
}

export default IFluidityFacade;

export const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>(
  {} as IFluidityFacade
);
