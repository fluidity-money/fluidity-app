// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {createContext} from "react";
import {isInArray} from "../../utils/types";

export const Chains = {
  ethereum: [
    "ropsten", 
    "mainnet",
  ],
  solana: [
    "devnet",
    "mainnet-beta",
  ],
} as const;

export const Tokens = {
  ethereum: ["USDT", "USDC", "DAI"],
  solana: ["USDT", "USDC"],
} as const;

export const ChainIds: {[K in Network<"ethereum">]: string} = {
  mainnet: "0x1",
  ropsten: "0x3",
}; 

export type SupportedUnwrappedToken<T extends Chain = Chain> = typeof Tokens[T][number];
export type SupportedFluidToken<T extends Chain = Chain> = `f${SupportedUnwrappedToken<T>}`;
export type SupportedToken<T extends Chain = Chain> = SupportedUnwrappedToken<T> | SupportedFluidToken<T>;

export type Chain = keyof typeof Chains;
export type NullableChain = Chain | null;
export type Network<C extends Chain = Chain> = typeof Chains[C][number]

export const isSupportedToken = <C extends Chain>(token: string, chain: C): token is SupportedUnwrappedToken<C> => {
  return isInArray(token, Tokens[chain])
}

interface ChainContextBase {
    setChain: (chain: Chain) => void

    disconnect: () => void
    connected: boolean
}

interface ChainContextNonNull {
    chain: Chain
    network: Network
    setNetwork: (network: string) => void
    connect: (network: Network) => void
    wrap: (token: string, amount: string | number) => void
    unwrap: (token: string, amount: string | number) => void
    send: (token: string, amount: string | number, recipient: string) => void
    balances: {[K in SupportedToken]?: string}
}

type ChainContext = ChainContextBase & 
  (ChainContextNonNull | {
    chain: null, 
    network?: never,
    setNetwork?: never,
    connect?: never,
    wrap?: never,
    unwrap?: never,
    send?: never,
    balances?: never
  })

export const ChainContext = createContext<ChainContext>({
    chain: null,
    connected: false,

    setChain: () => 0,
    disconnect: () => 0,
});

