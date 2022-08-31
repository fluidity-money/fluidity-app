// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import { useEffect } from "react";
import { addNetwork, switchNetwork } from "util/metamaskBrowserUtils";
import ChainId, { chainIdFromEnv, toChainId } from "util/chainId";

// switch ethereum chain or if that fails, add ethereum chain to metamask
const changeNetwork = async () => {
  try {
    //  if (!(window as any).ethereum) throw new Error("No crypto wallet found");
    if (!(window as any).ethereum) console.log("No crypto wallet found");
    await switchNetwork();
  } catch (err) {
    // if switching chains doesn't work, try adding the chain to the users metamask browser
    try {
      await addNetwork();
    } catch (err) {
      console.log("1", err);
    }
  }
};

const Toolbar = ({ children }: { children: JSX.Element }) => {
  const [desiredNetwork, setDesiredNetwork] = React.useState(true);
  const [chainId, setChainId] = React.useState<ChainId>(0);
  const [browserChainId, setBrowserChainId] = React.useState<ChainId | null>();

  // checks for metamask browser and if the chain needs to be switched/added
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
      if (browserChain !== envChain) changeNetwork();
    }
    // maybe add a popup for no inbrowser wallet found?
    if (!(window as any).ethereum)
      console.log("No in browser crypto wallet found");
  };

  // updates to information to match metamask chain in browser when changed
  const updateOnNetworkChange = () => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("chainChanged", () => {
        const browserChain = toChainId((window as any)?.ethereum.chainId);
        const envChain = chainIdFromEnv();

        browserChain && setChainId(envChain);
        // updates popup to switched chain
        setBrowserChainId(() => browserChain);
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
              : chainId === ChainId.AuroraMainnet
              ? `Aurora Mainnet`
              : `Ethereum`}
            )
            {` doesn't match to network selected in wallet${
              browserChainId === undefined || null
                ? "."
                : ` (network with id: ${browserChainId}).`
            } Learn how to `}
            <a
              className="learn-change-network-link"
              href="https://metamask.zendesk.com/hc/en-us/articles/4404424659995"
              target="_blank"
              rel="noreferrer"
            >
              {`change network in wallet`}
            </a>
            {` or   `}
          </div>
          <button
            className="change-network-button"
            onClick={() => changeNetwork()}
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
