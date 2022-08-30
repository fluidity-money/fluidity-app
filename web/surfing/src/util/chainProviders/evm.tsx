import { UseWalletProvider, useWallet } from "use-wallet";
import { InjectedConnector } from "@web3-react/injected-connector";

const EthProvider = ({children, chainId, ...props}: any) => {
  const providerOptions = {
    injected: new InjectedConnector({ supportedChainIds: [chainId] }),
    walletconnect: {
      rpcUrl: process.env.REACT_APP_WALLET_CONNECT_GETH_URI || "https://main-rpc.linkpool.io",
    },
  };
  
  return (
    <UseWalletProvider connectors={providerOptions}>
      {children}
    </UseWalletProvider>
  )
}

export { useWallet };

export default EthProvider;