// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { chainIdFromEnv } from "./chainId";

// Add and switch chain methods for metamask browser extension

// switches network/chain if present in metamask already
export const switchNetwork = async () => {
  await (window as any).ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [
      {
        chainId: `0x${chainIdFromEnv().toString(16)}`,
      },
    ],
  });
};

// adds and then switches network/chain if not present in metamask already
export const addNetwork = async () => {
  await (window as any).ethereum.request({
    method: "wallet_addEthereumChain",
    params: [addChainNetworks[`${chainIdFromEnv()}`]],
  });
};

// All below required for addNetwork function above

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

interface AddChainNetworks {
  [network: string]: AddEthereumChainParameter;
}

/*
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  Hardhat = 31337,
  Aurora Mainnet = 1313161554,
  */

/* 
  Network chain info for adding if user does not have network currently added to their metamask browser
  Network chain info from https://chainid.network/chains.json
  Each network listed via its chain id for usage based on current env
  */

const addChainNetworks: AddChainNetworks = {
  31337: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "GoChain Testnet",
    nativeCurrency: {
      name: "GoChain Coin",
      symbol: "GO",
      decimals: 18,
    },
    rpcUrls: ["https://testnet-rpc.gochain.io"],
  },

  1313161554: {
    chainId: `0x${Number(1313161554).toString(16)}`,
    chainName: "Aurora Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.aurora.dev"],
  },
};
