// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import localforage from "localforage";
import {useEffect, useState} from "react";
import {InterfaceProps} from ".";
import {isInArray} from "../../utils/types";
import {chainContext, Chains, Network} from "./chainContext";

const EthereumInterface = ({children, setChain, connected, setConnected}: InterfaceProps): JSX.Element => {
  const chain = "ethereum" as const;
  const ethereumNetworkKey = "persist.lastNetwork.ethereum";
  const [network, setNetwork] = useState<Network<"ethereum">>("mainnet");

  // set network if it's valid for the chain
  const setNetworkChecked = (network: string) => {
    if (isInArray(network, Chains[chain])) {
        localforage.setItem(ethereumNetworkKey, network);
        setNetwork(network)
      }
  }

  useEffect(() => {
    localforage.getItem(ethereumNetworkKey).then(storedNetwork => {
      if (isInArray(storedNetwork, Chains[chain])) {
        setNetworkChecked(storedNetwork);
      }
    });
  }, [])

  const connect = (network: Network) => {
    if (!isInArray(network, Chains[chain]))
      return;

    setNetwork(network);
    setConnected(true);
  }

  const disconnect = () => {
    setConnected(false);
  }

  const wrap = () => {
    if (!connected)
      return;
    console.log("wrap ethereum!")
  }

  const unwrap = () => {
    if (!connected)
      return;
    console.log("unwrap ethereum!")
  }

  const value = {
    chain,
    setChain,
    connected,
    network: network as Network,
    setNetwork: setNetworkChecked,
    connect,
    disconnect,
    wrap,
    unwrap,
  }

  return <chainContext.Provider value={value}>
    {children}
  </chainContext.Provider>
}

export default EthereumInterface;
