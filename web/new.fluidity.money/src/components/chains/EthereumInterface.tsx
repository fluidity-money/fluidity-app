// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import localforage from "localforage";
import {useEffect} from "react";
import {InterfaceProps} from ".";
import {isInArray} from "../../utils/types";
import {ChainContext, Chains, isSupportedToken, Network, SupportedFluidToken} from "./ChainContext";
import {useWallet} from "use-wallet"
import {useEthereumTokens} from "../../utils/hooks/useEthereumTokens";
import makeContractSwap from "../../utils/ethereum/transaction";
import useSigner from "../../utils/hooks/useSigner";

const EthereumInterface = ({children, setChain, connected, setConnected}: InterfaceProps): JSX.Element => {
  const chain = "ethereum" as const;
  const ethereumNetworkKey = "persist.lastNetwork.ethereum";
  const {fluidTokens, unwrappedTokens, network, setNetwork} = useEthereumTokens();
  const wallet = useWallet();
  const signer = useSigner();

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

  useEffect(() => {
    setConnected(wallet.isConnected)
  }, [wallet.isConnected])

  // useEffect(() => {
  //   console.log("network", wallet.networkName);
  // }, [wallet.networkName])

  const connect = (network: Network) => {
    if (!isInArray(network, Chains[chain]))
      return;

    wallet.connect("injected").then(_ => {
      setNetwork(network);
      setConnected(true);
    });
  }

  const disconnect = () => {
    wallet.reset();
    setConnected(false);
  }

  // @param token: the base token
  const wrap = async(token: string, amount: string | number) => {
    if (!connected || !signer || !isSupportedToken(token, chain))
      return;

    const fluidToken = fluidTokens['f' + token as SupportedFluidToken<"ethereum">]
    const unwrappedToken = unwrappedTokens[token]

    if (!fluidToken || !unwrappedToken) 
      return;

    try {
      const result = await makeContractSwap(signer, unwrappedToken, fluidToken, amount);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  // @param token: the base token
  const unwrap = async(token: string, amount: string | number) => {
    if (!connected || !signer || !isSupportedToken(token, chain))
      return;

    const fluidToken = fluidTokens['f' + token as SupportedFluidToken<"ethereum">]
    const unwrappedToken = unwrappedTokens[token]

    if (!fluidToken || !unwrappedToken) 
      return;

    try {
      const result = await makeContractSwap(signer, fluidToken, unwrappedToken, amount);
      console.log(result);
    } catch (error) {
      console.error(error);
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

  return <>
      <ChainContext.Provider value={value}>
        {children}
      </ChainContext.Provider>
  </>
}

export default EthereumInterface;
