
import {TokenKind} from "components/types";


// Image imports
const usdc = "img/TokenIcons/usdcIcon.svg";
const usdt = "img/TokenIcons/usdtIcon.svg";
const dai = "img/TokenIcons/daiIcon.svg";

// External token options
export const extOptions: TokenKind[] = [
  {
    type: "USDT",
    src: usdt,
    colour: "rgb(36,163,124)"
  },
  {
    type: "USDC",
    src: usdc,
    colour: "#2775c9",
  },
  {
    type: "DAI",
    src: dai,
    colour: "#fdc134",
  }
];

// Internal token options
export const intOptions: TokenKind[] = [
  {
    type: "fUSDT",
    src: usdt,
    colour: "rgb(36,163,124)"
  },
  {
    type: "USDC",
    src: usdc,
    colour: "#2775c9",
  },
  {
    type: "DAI",
    src: dai,
    colour: "#fdc134",
  }
];
