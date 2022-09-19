// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {BigintIsh} from "@saberhq/token-utils";
import {createContext} from "react";

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

const Tokens = {
  ethereum: ["USDT", "USDC", "DAI"],
  solana: ["USDT", "USDC"],
} as const;

export type SupportedToken<T extends keyof typeof Tokens = keyof typeof Tokens> = typeof Tokens[T][number];
export type Chain = keyof typeof Chains;
export type NullableChain = Chain | null;
export type Network<C extends Chain = keyof typeof Chains> = typeof Chains[C][number]

interface ChainContextBase {
    setChain: (chain: Chain) => void

    disconnect: () => void
    wrap: () => void
    unwrap: () => void
    connected: boolean
}

interface ChainContextNonNull {
    chain: Chain
    network: Network
    setNetwork: (network: string) => void
    connect: (network: Network) => void
}

type ChainContext = ChainContextBase & 
  (ChainContextNonNull | {
    chain: null, 
    network?: never,
    setNetwork?: never,
    connect?: never,
  })

export const chainContext = createContext<ChainContext>({
    chain: null,
    connected: false,

    setChain: () => 0,
    disconnect: () => 0,
    wrap: () => 0,
    unwrap: () => 0,
});

