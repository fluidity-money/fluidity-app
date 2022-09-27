// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {useEffect, useState} from "react";
import {isInArray} from "../../utils/types";
import {useSolana} from "@saberhq/use-solana";
import {DEFAULT_WALLET_PROVIDERS} from "@saberhq/use-solana";
import {BigintIsh} from "@saberhq/token-utils";
import {PublicKey} from "@solana/web3.js";
import {useSolanaTokens} from "../../utils/hooks/useSolanaTokens";
import {sendSol, unwrapSpl, wrapSpl} from "../../utils/solana/transaction";
import {InterfaceProps} from ".";
import {ChainContext, Chain, Chains, Network, SupportedFluidToken, isSupportedToken, SupportedToken} from "./ChainContext";
import localforage from "localforage";
import BN from "bn.js";
import {getBalanceOfSPL} from "../../utils/solana/transactionUtils";

const SolanaInterface = ({children, setChain, connected, setConnected}: InterfaceProps): JSX.Element => {
  const chain: Chain = "solana";
  const solanaNetworkKey = "persist.lastNetwork.solana";
  const {fluidProgramId, fluidTokens, unwrappedTokens, network, setNetwork} = useSolanaTokens();
  const [balances, setBalances] = useState<{[K in SupportedToken<"solana">]?: string}>({});
  const solana = useSolana();
  const solanaConnected = solana.connected;
  const wallets = DEFAULT_WALLET_PROVIDERS;

  useEffect(() => {
    const {publicKey} = solana || {};
    if (!publicKey || !connected)
      return;

    const pendingBalances: typeof balances = {};
    (async () => {
      for (const token of Object.values({...fluidTokens, ...unwrappedTokens})) {
        const balance = await getBalanceOfSPL(token, solana.connection, publicKey);
        pendingBalances[token.symbol as SupportedToken<"solana">] = balance;
      }
      setBalances(pendingBalances);
    })();

  }, [unwrappedTokens, fluidTokens, connected])

  useEffect(() => {
    localforage.getItem(solanaNetworkKey).then(storedNetwork => {
      if (isInArray(storedNetwork, Chains[chain])) {
        setNetworkChecked(storedNetwork);
      }
    });
  }, [])

  useEffect(() => {
    setConnected(solanaConnected)
  }, [solanaConnected])

  useEffect(() => {
    setNetworkChecked(solana.network);
  }, [solana.network])

  // set network if it's valid for the chain
  const setNetworkChecked = (network: string) => {
    if (isInArray(network, Chains[chain])) {
        localforage.setItem(solanaNetworkKey, network);
        solana.setNetwork(network);
        setNetwork(network)
    }
  }

  const connect = (network: Network, wallet?: string) => {
    if (!isInArray(network, Chains[chain]))
      return;

    if (!isInArray(wallet, Object.keys(wallets) as Array<keyof typeof DEFAULT_WALLET_PROVIDERS>)) {
      return;
    }

    solana.activate(wallet);
  }

  const disconnect = async() => {
    await solana.disconnect();
  }

  // amount in token's decimals, e.g. 1,500,000 to wrap 1.5 of a 6 decimal token
  const wrap = async (token: string, amount: BigintIsh) => {
    if (!connected || !fluidProgramId || !network || !isSupportedToken(token, chain))
      return;

    const fluidToken = fluidTokens['f' + token as SupportedFluidToken<"solana">]
    const unwrappedToken = unwrappedTokens[token]

    if (!fluidToken || !unwrappedToken) 
      return;

    try {
      return await wrapSpl(solana, fluidProgramId, unwrappedToken, fluidToken, amount, network);
    } catch(e) {
      console.error(`Failed to wrap token ${token}!`, e);
    }
  }

  const unwrap = async(token: string, amount: BigintIsh) => {
    if (!connected || !fluidProgramId || !network || !isSupportedToken(token, chain))
      return;
    
    const fluidToken = fluidTokens['f' + token as SupportedFluidToken<"solana">]
    const unwrappedToken = unwrappedTokens[token]

    if (!fluidToken || !unwrappedToken)
      return;

    try {
      return await unwrapSpl(solana, fluidProgramId, unwrappedToken, fluidToken, amount, network);
    } catch(e) {
      console.error(`Failed to unwrap token ${token}!`, e);
    }
  }

  const send = async(token: string, amount: string | number, recipient: string) => {
    const fluidToken = fluidTokens[token as SupportedFluidToken<"solana">];
    if (!fluidToken)
      return;

    const balance = balances[token as SupportedFluidToken<"solana">]
    if (!balance)
      return;

    const tokenAmount = fluidToken.tokenAmount(amount);
     
    if (new BN(balance).lt(new BN(amount))) {
      console.error(
        `Trying to send ${fluidToken.tokenAmount(amount)
          .toExact()
        }, but balance is ${fluidToken.tokenAmount(balance)
          .toExact()
        }`
      );
      return;
    }

    try {
      const result = await sendSol(
        solana,
        new PublicKey(recipient),
        tokenAmount,
      );
      console.log(result);
    } catch (e: any) {
      console.error(`Failed to send tokens! ${e?.message}`);
    }
  }

  const value = {
    chain,
    setChain,
    connected,
    balances,
    wallets,
    network: network as Network,
    setNetwork: setNetworkChecked,
    connect,
    disconnect,
    wrap,
    unwrap,
    send,
  }

  return <ChainContext.Provider value={value}>
    {children}
  </ChainContext.Provider>
}

export default SolanaInterface;
