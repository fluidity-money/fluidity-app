// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import localforage from "localforage";
import {useEffect, useState} from "react";
import {InterfaceProps} from ".";
import {isInArray} from "../../utils/types";
import {ChainContext, ChainIds, Chains, isSupportedToken, Network, SupportedFluidToken, SupportedToken} from "./ChainContext";
import {useWallet} from "use-wallet"
import {useEthereumTokens} from "../../utils/hooks/useEthereumTokens";
import makeContractSwap, {getBalanceOfERC20, getContract, handleContractErrors} from "../../utils/ethereum/transaction";
import {utils} from "ethers";
import useSigner from "../../utils/hooks/useSigner";

const EthereumInterface = ({children, setChain, connected, setConnected}: InterfaceProps): JSX.Element => {
  const chain = "ethereum" as const;
  const ethereumNetworkKey = "persist.lastNetwork.ethereum";
  const {fluidTokens, unwrappedTokens, network, setNetwork} = useEthereumTokens();
  const [balances, setBalances] = useState<{[K in SupportedToken<"ethereum">]?: string}>({});
  const wallet = useWallet();
  const signer = useSigner();
  const wallets = {metamask: "metamask"};

  useEffect(() => {
    if (!signer || !connected)
      return;

    const pendingBalances: typeof balances = {};
    (async () => {
      for (const token of Object.values({...fluidTokens, ...unwrappedTokens})) {
        const balance = await getBalanceOfERC20(token, signer);
        pendingBalances[token.symbol as SupportedToken] = balance;
      }
      setBalances(pendingBalances);
    })();

  }, [unwrappedTokens, fluidTokens, connected])

  // set network if it's valid for the chain
  const setNetworkChecked = async(network: string) => {
    if (isInArray(network, Chains[chain])) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: ChainIds[network]}],
        });
        localforage.setItem(ethereumNetworkKey, network);
        setNetwork(network);
      } catch (e) {
        console.error("Failed to switch network!", e);
      }
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

  const send = async(token: string, amount: string | number, recipient: string) => {
    if (!signer)
      return;
 
    const fluidToken = fluidTokens[token as SupportedFluidToken<"ethereum">]
    if (!fluidToken)
      return;

    const balance = balances[token as SupportedFluidToken<"ethereum">]
    if (!balance)
      return;

    const balanceBig = utils.parseUnits(balance, fluidToken.decimals);
    const amountBig = utils.parseUnits(String(amount), fluidToken.decimals);

    if (balanceBig.lt(amountBig)) {
      console.error(`Trying to send ${amount}, but balance is only ${balance}`);
      return;
    }

    const contract = getContract(
      signer,
      fluidToken
    );

    if (!contract)
      return;

    try {
      const transferResult = await contract.transfer(recipient, amountBig);
      await transferResult.wait();
      console.log(transferResult);
    } catch (e: any) {
      e.arg == "address"
        ? console.error(`${recipient} is an invalid Ethereum address`)
        : await handleContractErrors(e, signer.provider);
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

  return <>
      <ChainContext.Provider value={value}>
        {children}
      </ChainContext.Provider>
  </>
}

export default EthereumInterface;
