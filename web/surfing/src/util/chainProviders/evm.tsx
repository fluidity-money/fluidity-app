// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

// import { UseWalletProvider, useWallet } from "use-wallet";
// import { InjectedConnector } from "@web3-react/injected-connector";

const EthProvider = ({children, chainId, ...props}: any) => {
  //const providerOptions = {
  //  injected: new InjectedConnector({ supportedChainIds: [chainId] }),
  //  walletconnect: {
  //    rpcUrl: process.env.REACT_APP_WALLET_CONNECT_GETH_URI || "https://main-rpc.linkpool.io",
  //  },
  //};
  
  return (
    <div>{children}</div>
    //<UseWalletProvider connectors={providerOptions}>
      //{children}
    //</UseWalletProvider>
  )
}

//export { useWallet };

export default EthProvider;