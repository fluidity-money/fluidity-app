// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

export type SupportedTokens = "USDC" | "USDT" | "DAI" | "TUSD" | "Fei";
export type FluidSupportedTokens = `f${SupportedTokens}`;
export type Token = SupportedTokens | FluidSupportedTokens;

//for selector component
export type TokenKind = {
  symbol: Token | "Select Token" | "Select FLUID";
  name: string;
  image: string;
  colour: string;
  address: string;
  decimals: number;
  amount: string;
  pinned: boolean;
};

export interface TokenList {
  kind: TokenKind[];
}
