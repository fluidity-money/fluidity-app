// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {SolanaProvider} from "@saberhq/use-solana";
import {useEffect, useState} from "react";
import {NullableChain} from "./chainContext";
import EthereumInterface from "./EthereumInterface";
import SolanaInterface from "./SolanaInterface";

const ChainInterface = ({children}: {children: React.ReactNode}) => {
  // TODO try to source from localforage on first load
  const [chain, setChain_] = useState<NullableChain>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(false);
  }, [chain]);

  // stop auto login when setting chain
  const setChain = (chain: NullableChain) => {
    localStorage.removeItem("use-solana/wallet-config");
    setChain_(chain)
  }

  switch (chain) {
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
