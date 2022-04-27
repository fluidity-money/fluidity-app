import React from "react";
import { useEffect } from "react";
import ChainId, { chainIdFromEnv, toChainId } from "util/chainId";

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

const kovan: AddEthereumChainParameter = {
  chainId: `0x${Number(45).toString(16)}`,
  chainName: "Ethereum Testnet Kovan",
  nativeCurrency: {
    name: "Kovan",
    symbol: "KOV",
    decimals: 18,
  },
  rpcUrls: [
    "https://kovan.poa.network",
    "http://kovan.poa.network:8545",
    "https://kovan.infura.io/v3/d1ac3dc1af2649908a69582ffa1a424d",
    "wss://kovan.infura.io/ws/v3/d1ac3dc1af2649908a69582ffa1a424d",
    "ws://kovan.poa.network:8546",
  ],
  blockExplorerUrls: ["https://kovan.etherscan.io"],
};

// switchEthereumChain for Ropsten and Mainnet
const changeNetwork = async () => {
  try {
    if (!(window as any).ethereum) throw new Error("No crypto wallet found");
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${process.env.REACT_APP_CHAIN_ID}` }],
    });
  } catch (err: any) {
    if (err.code === 4902) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [kovan],
        });
      } catch (err) {
        throw err;
      }
    }
  }
};

const Toolbar = ({ children }: { children: JSX.Element }) => {
  const [desiredNetwork, setDesiredNetwork] = React.useState(true);
  const [chainId, setChainId] = React.useState<ChainId>(0);

  const handleNetworkSwitch = async () => {
    await changeNetwork();
  };

  const checkNetworkOnLoad = async () => {
    // if metamask browser is present, check the network
    if ((window as any).ethereum) {
      const chain = await (window as any).ethereum.request({
        method: "eth_chainId",
      });
      const browserChain = toChainId(chain);
      const envChain = chainIdFromEnv();

      browserChain && setChainId(envChain);
      setDesiredNetwork(browserChain === envChain);
    }
  };

  const updateOnNetworkChange = () => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("chainChanged", () => {
        const browserChain = toChainId((window as any)?.ethereum.chainId);
        const envChain = chainIdFromEnv();

        browserChain && setChainId(envChain);
        setDesiredNetwork(browserChain === envChain);
      });
    }
  };

  useEffect(() => {
    checkNetworkOnLoad();
    updateOnNetworkChange();
  }, []);

  return (
    <div className="toolbar p-0_5">
      {children}
      {desiredNetwork === false ? (
        <div className="change-network-message">
          <div className="change-network-text">
            App network (
            {chainId === ChainId.Ropsten
              ? `Ethereum Ropsten`
              : chainId === ChainId.Mainnet
              ? `Ethereum Mainnet`
              : chainId === ChainId.Kovan
              ? `Ethereum Kovan`
              : `Ethereum`}
            )
            {` doesn't match to network selected in wallet (network with id:
          ${chainId}). Learn how to`}
            <a
              className="learn-change-network-link"
              href="https://metamask.zendesk.com/hc/en-us/articles/4404424659995"
              target="_blank"
              rel="noreferrer"
            >
              {` change network in wallet`}
            </a>
            {` or   `}
          </div>
          <button
            className="change-network-button"
            onClick={() => handleNetworkSwitch()}
          >
            Change Network
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export const WalletToolbar = ({ children }: { children: JSX.Element }) => {
  return <div className="wallet-menu-container">{children}</div>;
};

export default Toolbar;
