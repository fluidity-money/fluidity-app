import { createContext } from "react";

interface IFluidityFacade {
  swap: (amount: string, token: string) => Promise<void>;
  limit: (token: string) => Promise<number>;
  balance: (token: string) => Promise<number>;
  disconnect: () => Promise<void>;

  useConnectorType: (use: string) => void;

  address: string;
}

export default IFluidityFacade;

export const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>(
  {} as IFluidityFacade
);
