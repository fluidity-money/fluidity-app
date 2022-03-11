import {FluidSupportedTokens, SupportedTokens} from "components/types";

//TODO should probably be sourced from env vars to allow flexibility between dev and prod

//the same program is used for every token
export const FLUID_PROGRAM_ID = "HXCKzsLf5ohVEYo5shk7MjhbqeUemwikBj4667aPhmK9";

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

export const tokenList: SolTokenList = [
  {
    name: "USD Coin",
    symbol: "USDC",
    mintAddress: "zVzi5VAf4qMEwzv7NXECVx5v2pQ7xnqVVjCXZwS9XzA",
    decimals: 6,
  },
  {
    name: "Fluid USDC",
    symbol: "fUSDC",
    mintAddress: "5jsh1taLrqNgiV3UN8diDxZAXRC7T4iALfNWwThBksoj",
    decimals: 6,
  },
  {
    name: "Tether USD",
    symbol: "USDT",
    mintAddress: "Bp2nLuamFZndE7gztA1iPsNVhdJeg9xfKdq7KmvjpGoP",
    decimals: 6,
  },
  {
    name: "Fluid USDT",
    symbol: "fUSDT",
    mintAddress: "Dx8dUQ8p8zbQwv7jvXqaEdYWcK7AroNifHbcAC7YYRjg",
    decimals: 6,
  },
]
