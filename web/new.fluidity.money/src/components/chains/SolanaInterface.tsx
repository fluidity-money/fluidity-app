// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {useEffect} from "react";
import {isInArray} from "../../utils/types";
import {useSolana} from "@saberhq/use-solana";
import {BigintIsh} from "@saberhq/token-utils";
import {useSolanaTokens} from "../../utils/hooks/useSolanaTokens";
import {unwrapSpl, wrapSpl} from "../../utils/solana/transaction";
import {InterfaceProps} from ".";
import {chainContext, Chain, Chains, Network, SupportedFluidToken, SupportedUnwrappedToken} from "./chainContext";

const SolanaInterface = ({children, setChain, connected, setConnected}: InterfaceProps): JSX.Element => {
  const chain: Chain = "solana";
  const {fluidProgramId, fluidTokens, unwrappedTokens, network, setNetwork} = useSolanaTokens();
  const solana = useSolana();
  const solanaConnected = solana.connected;

  useEffect(() => {
    setConnected(solanaConnected)
  }, [solanaConnected])

  useEffect(() => {
    setNetworkChecked(solana.network);
  }, [solana.network])

  // set network if it's valid for the chain
  const setNetworkChecked = (network: string) => {
    if (isInArray(network, Chains[chain])) {
        solana.setNetwork(network);
        setNetwork(network)
    }
  }

  const connect = (network: Network) => {
    if (!isInArray(network, Chains[chain]))
      return;

    // TODO choose wallet
    let b: string = "Sollet";
    solana.activate(b);
    // setNetwork(network);
  }

  const disconnect = async() => {
    solana.disconnect();
  }

  // amount in token's decimals, e.g. 1,500,000 to wrap 1.5 of a 6 decimal token
  const wrap = async (token: SupportedUnwrappedToken<"solana">, amount: BigintIsh) => {
    if (!connected || !fluidProgramId)
      return;
    
    const fluidToken = fluidTokens['f' + token as SupportedFluidToken<"solana">]
    const unwrappedToken = unwrappedTokens[token]

    if (!fluidToken || !unwrappedToken || !network)
      return;

    try {
      return await wrapSpl(solana, fluidProgramId, unwrappedToken, fluidToken, amount, network);
    } catch(e) {
      console.error(`Failed to wrap token ${token}!`, e);
    }
  }

  const unwrap = async(token: SupportedUnwrappedToken<"solana">, amount: BigintIsh) => {
    if (!connected || !fluidProgramId)
      return;
    
    const f = fluidTokens['f' + token as SupportedFluidToken<"solana">]
    const u = unwrappedTokens[token]

    if (!f || !u || !network)
      return;

    try {
      return await unwrapSpl(solana, fluidProgramId, u, f, amount, network);
    } catch(e) {
      console.error(`Failed to wrap token ${token}!`, e);
    }
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

export default SolanaInterface;
