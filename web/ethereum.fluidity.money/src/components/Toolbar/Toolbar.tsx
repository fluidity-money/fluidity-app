import React from "react";
import { useEffect } from "react";

const Toolbar = ({ children }: { children: JSX.Element }) => {
  const [desiredNetwork, setDesiredNetwork] = React.useState(true);
  const [chainId, setChainId] = React.useState<string>();

  const checkNetworkOnLoad = async () => {
    const chainId = await (window as any).ethereum.request({
      method: "eth_chainId",
    });
    if (chainId !== `0x${process.env.REACT_APP_CHAIN_ID}`) {
      setDesiredNetwork(false);
      setChainId(chainId.substring(2));
    } else {
      setDesiredNetwork(true);
      setChainId(chainId.substring(2));
    }
  };

  const updateOnNetworkChange = () => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("chainChanged", () => {
        if (
          (window as any).ethereum.chainId !==
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
          App network (
          {process.env.REACT_APP_CHAIN_ID === `3`
            ? `Ethereum Ropsten`
            : process.env.REACT_APP_CHAIN_ID === `1`
            ? `Ethereum Mainnet`
            : `Ethereum`}
          )
          {` doesn't match to network selected in wallet (network with id:
          ${chainId}). Learn how to change`}
          <a
            className="change-network-link"
            href="https://metamask.zendesk.com/hc/en-us/articles/4404424659995"
            target="_blank"
            rel="noreferrer"
          >
            {` network in wallet`}
          </a>
          {` or `}
          <a
            className="change-network-link"
            href="https://chainlist.org/"
            target="_blank"
            rel="noreferrer"
          >
            change network
          </a>
          .
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
