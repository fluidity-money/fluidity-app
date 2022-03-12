import React from "react";
import {TokenKind} from "components/types";
import Routes from "util/api/types";

// Context for swap page modal toggle
export interface SwapModalStatus {
  toggleTo: [boolean, () => void]; // State modal toggle for 'To' swap value
  toggleFrom: [boolean, () => void]; // State modal toggle for 'From' swap value
  selectedToken: [
    TokenKind["type"],
    (input: TokenKind["type"], index: number) => void
  ]; // Selected standard token
  selectedFluidToken: [
    TokenKind["type"],
    (input: TokenKind["type"], index: number) => void
  ]; // Selected fluid token
}

export const modalToggle = React.createContext<SwapModalStatus>({
  toggleTo: [false, () => {}],
  toggleFrom: [false, () => {}],
  selectedToken: ["Select Token", (input) => {}],
  selectedFluidToken: ["Select FLUID", (input) => {}],
});

export const userActionContext = React.createContext<Routes['/my-history']>([])
