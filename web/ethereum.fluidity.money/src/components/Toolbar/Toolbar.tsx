import React from "react";
import { useEffect } from "react";

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

interface switchEthereumChainParameter {
  chainId: string;
}

const ethId: switchEthereumChainParameter = {
  chainId: `0x${process.env.REACT_APP_CHAIN_ID}`,
};

const go: AddEthereumChainParameter = {
  chainId: `0x${Number(31337).toString(16)}`,
  chainName: "GoChain Testnet",
  nativeCurrency: {
    name: "GoChain Coin",
    symbol: "GO",
    decimals: 18,
  },
  rpcUrls: [`https://mainnet.anyswap.exchange`],
  blockExplorerUrls: [
    "https://testnet-explorer.gochain.io",
    "https://fsn.dev/api",
  ],
};

// addEthereumChain and go params for go and switchEthereumChain and ethId params for Ropsten and Mainnet
const changeNetwork = async () => {
  let method = "";
  let params: AddEthereumChainParameter[] | switchEthereumChainParameter[];
  try {
    if (process.env.REACT_APP_CHAIN_ID === "31337") {
      method = "wallet_addEthereumChain";
      params = [go];
    } else {
      method = "wallet_switchEthereumChain";
      params = [ethId];
      if (!(window as any).ethereum) throw new Error("No crypto wallet found");
      await (window as any).ethereum.request({
        method: method,
        params: params,
      });
    }
  } catch (err) {
    throw err;
  }
};

const Toolbar = ({ children }: { children: JSX.Element }) => {
  const [desiredNetwork, setDesiredNetwork] = React.useState(true);
  const [chainId, setChainId] = React.useState<string>();

  const handleNetworkSwitch = async () => {
    await changeNetwork();
  };

  const checkNetworkOnLoad = async () => {
    const chain = await (window as any).ethereum.request({
      method: "eth_chainId",
    });
    if (`${chain}` !== `0x${process.env.REACT_APP_CHAIN_ID}`) {
      setDesiredNetwork(false);
      setChainId(chain.substring(2));
    } else {
      setDesiredNetwork(true);
      setChainId(chain.substring(2));
    }
  };

  const updateOnNetworkChange = () => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("chainChanged", () => {
        if (
          `${(window as any).ethereum.chainId}` !==
          `0x${process.env.REACT_APP_CHAIN_ID}`
        ) {
          setDesiredNetwork(false);
          setChainId((window as any).ethereum.chainId.substring(2));
        } else {
          setDesiredNetwork(true);
          setChainId((window as any).ethereum.chainId.substring(2));
        }
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
            {process.env.REACT_APP_CHAIN_ID === `3`
              ? `Ethereum Ropsten`
              : process.env.REACT_APP_CHAIN_ID === `1`
              ? `Ethereum Mainnet`
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
