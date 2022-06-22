import React from "react";
import { TokenKind } from "components/types";
import Routes from "util/api/types";
import { FluidTokenList } from "util/hooks/useFluidTokens";

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

export const ModalToggle = React.createContext<SwapModalStatus>({
  toggleTo: [false, () => {}],
  toggleFrom: [false, () => {}],
  selectedToken: ["Select Token", (input) => {}],
  selectedFluidToken: ["Select FLUID", (input) => {}],
});

// Context for loading status modal
export interface ILoadingStatus {
  toggle: [boolean, (state: boolean) => void]; // [state of toggle, toggle function]
}

export const LoadingStatusToggle = React.createContext<ILoadingStatus>({
  toggle: [false, () => {}],
});

export const UserActionContext = React.createContext<Routes["/my-history"]>([]);

// interface for token select tokens context
export interface ITokenListContext {
  selectPinnedTokens: FluidTokenList;
  setSelectPinnedTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>;
  selectPinnedFluidTokens: FluidTokenList;
  setSelectPinnedFluidTokens: React.Dispatch<
    React.SetStateAction<FluidTokenList>
  >;
  selectTokens: FluidTokenList;
  setSelectTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>;
  selectFluidTokens: FluidTokenList;
  setSelectFluidTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>;
}

export const TokenListContext = React.createContext<ITokenListContext>({
  selectPinnedTokens: [],
  selectPinnedFluidTokens: [],
  setSelectPinnedTokens: () => {},
  setSelectPinnedFluidTokens: () => {},
  selectTokens: [],
  setSelectTokens: () => {},
  selectFluidTokens: [],
  setSelectFluidTokens: () => {},
});
