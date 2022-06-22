import {FluidSupportedTokens, SupportedTokens} from "components/types";

//the same program is used for every token
const FLUID_PROGRAM_ID_ = process.env.REACT_APP_FLUID_PROGRAM_ID;
if (!FLUID_PROGRAM_ID_)
  throw new Error("REACT_APP_FLUID_PROGRAM_ID unset!");

export const FLUID_PROGRAM_ID = FLUID_PROGRAM_ID_;

export type BaseToken = {
  name: string,
  symbol: SupportedTokens | "Select Token" | "Select FLUID"
  mintAddress: string,
  decimals?: number,
}

export type FluidToken = {
  name: string,
  symbol: FluidSupportedTokens,
  mintAddress: string,
  decimals?: number
}

export type SolTokenList = Array<BaseToken | FluidToken>

/**
 * @deprecated 
 */
export const tokenList: SolTokenList = [
  {
    name: "USD Coin",
    symbol: "USDC",
    mintAddress: process.env.REACT_APP_BASE_MINT_USDC || "",
    decimals: 6,
  },
  {
    name: "Fluid USDC",
    symbol: "fUSDC",
    mintAddress: process.env.REACT_APP_FLU_MINT_USDC || "",
    decimals: 6,
  },
  {
    name: "Tether USD",
    symbol: "USDT",
    mintAddress: process.env.REACT_APP_BASE_MINT_USDT || "",
    decimals: 6,
  },
  {
    name: "Fluid USDT",
    symbol: "fUSDT",
    mintAddress: process.env.REACT_APP_FLU_MINT_USDT || "",
    decimals: 6,
  },
  {
    name: "UXD",
    symbol: "UXD",
    mintAddress: process.env.REACT_APP_BASE_MINT_UXD || "",
    decimals: 6,
  },
  {
    name: "Fluid UXD",
    symbol: "fUXD",
    mintAddress: process.env.REACT_APP_FLU_MINT_UXD || "",
    decimals: 6,
  },
  {
    name: "TerraUSD",
    symbol: "UST",
    mintAddress: process.env.REACT_APP_BASE_MINT_UST || "",
    decimals: 6,
  },
  {
    name: "Fluid UST",
    symbol: "fUST",
    mintAddress: process.env.REACT_APP_FLU_MINT_UST || "",
    decimals: 6,
  }
]
