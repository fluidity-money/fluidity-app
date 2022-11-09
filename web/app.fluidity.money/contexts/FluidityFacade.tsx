import { createContext } from "react";

export interface IFluidityFacade {
  swap: (
    amount: string,
    fluidToken: string,
    swapForFluid: boolean
  ) => Promise<void>;
  limit: () => Promise<number>;
  balance: (token: string) => Promise<string>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;

  useConnectorType: (use: string) => void;

  connected: boolean;
  address: string;
}

const FluidityFacadeContext = createContext<Partial<IFluidityFacade>>({
  connected: false,
});

export default FluidityFacadeContext;
