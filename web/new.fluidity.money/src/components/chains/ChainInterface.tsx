// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {SolanaProvider} from "@saberhq/use-solana";
import localforage from "localforage";
import {useEffect, useState} from "react";
import {isInArray} from "../../utils/types";
import {Chain, Chains, NullableChain} from "./chainContext";
import EthereumInterface from "./EthereumInterface";
import SolanaInterface from "./SolanaInterface";


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
      <EthereumInterface setChain={setChain} connected={connected} setConnected={setConnected}>
        {children}
      </EthereumInterface>
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
