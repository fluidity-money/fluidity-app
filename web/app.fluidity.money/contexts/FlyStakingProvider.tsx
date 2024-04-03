import { createContext } from "react";

type FlyStakingContextShape = {
  toggleVisibility?: (state: boolean) => void;
  shouldUpdateBalance?: () => void;
};

export const FlyStakingContext = createContext<FlyStakingContextShape>({});
