import type { Dispatch, SetStateAction } from "react";

import Web3 from "web3";
import { useState, createContext } from "react";

export type AppWeb3 = {
  qr?: string;
  provider?: "walletconnect" | "browser";
  account?: string;
  web3: Web3;
};

type Web3ContextValues = {
  state: AppWeb3;
  /**
   * Dispatches an action to the reducer.
   *
   * Not supposed to be used by consumers of this context.
   *
   * Passed as an exit hatch for components that need to interact with the provider.
   *
   * i.e The Logout button needs to force a provider disconnect.
   *
   * @param action
   * @internal
   */
  dispatch: Dispatch<SetStateAction<AppWeb3>>;
};

const initState = (): AppWeb3 => ({
  account: "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6",
  web3: new Web3(),
});

const Web3Context = () => {
  const [state, dispatch] = useState<AppWeb3>(initState());

  return createContext<Web3ContextValues>({
    state,
    dispatch,
  });
};

export { Web3Context, initState };
