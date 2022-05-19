
import {TokenKind} from "components/types";


// Image imports
const usdc = "img/TokenIcons/usdcIcon.svg";
const usdt = "img/TokenIcons/usdtIcon.svg";
const dai = "img/TokenIcons/daiIcon.svg";
const sol = "img/TokenIcons/solanaIcon.svg";
const uxd = "img/TokenIcons/uxdIcon.svg"
const ust = "img/TokenIcons/ustIcon.svg"

// External token options
export const extOptions: TokenKind[] = [
  {
    type: "USDC",
    src: usdc,
    colour: "rgb(49,139,212)"
  },
  {
    type: "USDT",
    src: usdt,
    colour: "rgb(36,163,124)"
  },
  {
    type: "UXD",
    src: uxd,
    colour: "#000000"
  },
  {
    type: "UST",
    src: ust,
    colour: "#0C3595"
  },
  
  // {
  //   type: "DAI",
  //   src: dai,
  //   colour: "rgb(252,184,49)"
  // },
  // {
  //   type: "SOL",
  //   src: sol,
  //   colour: "rgb(220,31,255)"
  // }
];

// Internal token options
export const intOptions: TokenKind[] = [
  {
    type: "fUSDC",
    src: usdc,
    colour: "rgb(49,139,212)"
  },
  {
    type: "fUSDT",
    src: usdt,
    colour: "rgb(36,163,124)"
  },
  {
    type: "fUXD",
    src: uxd,
    colour: "#000000"
  },
  {
    type: "fUST",
    src: ust,
    colour: "#0C3595"
  },
  // {
  //   type: "fDAI",
  //   src: dai,
  //   colour: "rgb(252,184,49)"
  // },
  // {
  //   type: "fSOL",
  //   src: sol,
  //   colour: "rgb(100,31,255)"
  // }
];
