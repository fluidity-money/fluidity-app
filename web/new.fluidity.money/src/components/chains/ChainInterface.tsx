// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {SolanaProvider} from "@saberhq/use-solana";
import {InjectedConnector} from "@web3-react/injected-connector";
import localforage from "localforage";
import {useEffect, useState} from "react";
import {UseWalletProvider} from "use-wallet";
import {isInArray} from "../../utils/types";
import {Chain, ChainIds, Chains, NullableChain} from "./ChainContext";
import EthereumInterface from "./EthereumInterface";
import SolanaInterface from "./SolanaInterface";

const providerOptions = {
  injected: new InjectedConnector({ supportedChainIds: Object.values(ChainIds) }),
};

const ChainInterface = ({children}: {children: React.ReactNode}) => {
  const lastChainKey = "persist.lastChain";
  const [chain, setChain_] = useState<NullableChain | "loading">("loading");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(false);
  }, [chain]);

  // load previous chain on component mount
  useEffect(() => {
    localforage.getItem(lastChainKey).then(storedChain => {
      const isValidChain = isInArray(storedChain, Object.keys(Chains) as Chain[]);

      if (storedChain === null || isValidChain)
        setChain(storedChain); 
      else
        localforage.removeItem(lastChainKey);
    });
  }, [])

  // stop auto login when setting chain
  const setChain = (chain: NullableChain) => {
    localStorage.removeItem("use-solana/wallet-config");
    localforage.setItem(lastChainKey, chain)
    setChain_(chain)
  }

  switch (chain) {
  case "loading" || null:
    return <>
      {children}
    </>
  case "ethereum":
  default:
    return <>
    <UseWalletProvider connectors={providerOptions}>
      <EthereumInterface setChain={setChain} connected={connected} setConnected={setConnected}>
        {children}
      </EthereumInterface>
    </UseWalletProvider>
    </>
  case "solana":
    return <>
    <SolanaProvider>
        <SolanaInterface setChain={setChain} connected={connected} setConnected={setConnected}>
          {children}
        </SolanaInterface>
    </SolanaProvider>
    </>
  }
}

export default ChainInterface;
