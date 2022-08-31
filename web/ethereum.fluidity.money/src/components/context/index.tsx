// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import React from "react";
import { TokenKind, TokenList } from "components/types";
import Routes from "util/api/types";

// Context for swap page modal toggle
export interface SwapModalStatus {
  toggleTo: [boolean, () => void]; // State modal toggle for 'To' swap value
  toggleFrom: [boolean, () => void]; // State modal toggle for 'From' swap value
  selectedToken: [TokenKind["symbol"], (input: TokenKind["symbol"]) => void]; // Selected standard token
  selectedFluidToken: [
    TokenKind["symbol"],
    (input: TokenKind["symbol"]) => void
  ]; // Selected fluid token
}

export const modalToggle = React.createContext<SwapModalStatus>({
  toggleTo: [false, () => {}],
  toggleFrom: [false, () => {}],
  selectedToken: ["Select Token", (input) => {}],
  selectedFluidToken: ["Select FLUID", (input) => {}],
});

export const userActionContext = React.createContext<Routes["/my-history"]>([]);

// interface for token select tokens context
export interface TokenListContext {
  pinnedTokens: TokenKind[];
  setPinnedTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>;
  pinnedFluidTokens: TokenKind[];
  setPinnedFluidTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>;
  tokens: TokenKind[];
  setTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>;
  fluidTokens: TokenKind[];
  setFluidTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>;
}

export const tokenListContext = React.createContext<TokenListContext>({
  pinnedTokens: [],
  pinnedFluidTokens: [],
  setPinnedTokens: () => {},
  setPinnedFluidTokens: () => {},
  tokens: [],
  setTokens: () => {},
  fluidTokens: [],
  setFluidTokens: () => {},
});
