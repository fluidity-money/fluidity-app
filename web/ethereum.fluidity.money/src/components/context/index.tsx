import React from "react";
import { TokenKind } from "components/types";
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

// interface for pinned token list context
export interface TokenListContext {
  pinnedTokens: any;
  pinnedFluidTokens: any;
  setPinnedTokens: any;
  setPinnedFluidTokens: any;
}

export const tokenListContext = React.createContext<TokenListContext>({
  pinnedTokens: [],
  pinnedFluidTokens: [],
  setPinnedTokens: () => {},
  setPinnedFluidTokens: () => {},
});
