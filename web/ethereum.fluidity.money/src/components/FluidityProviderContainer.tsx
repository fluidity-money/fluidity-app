import React from "react";
import { FluidityEthereumProvider } from "fluid-web3-provider";
import { useWallet } from "use-wallet";
import { root_websocket as provider } from "util/api";
import { useContext } from "react";
import { tokenListContext } from "components/context";

const FluidityProviderContainer = ({ children }: any) => {
  const wallet = useWallet();
  const address = wallet.account;
  const tokenAddresses = useContext(tokenListContext).fluidTokens.map(
    (t) => t.address
  );

  return (
    <FluidityEthereumProvider
      {...{
        address,
        provider,
        tokenAddresses,
      }}
    >
      {children}
    </FluidityEthereumProvider>
  );
};

export default FluidityProviderContainer;
