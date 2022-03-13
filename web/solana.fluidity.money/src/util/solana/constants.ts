import {FluidSupportedTokens, SupportedTokens} from "components/types";

//TODO should probably be sourced from env vars to allow flexibility between dev and prod

//the same program is used for every token
export const FLUID_PROGRAM_ID = "GjRwsHMgCAX2QUrw64tyT9RQhqm28fmntNAjgxoaTztU";
//the same pda account is used for every token

/*
 * for each SPL token, we need
 *   - the token mint address
 *   - the ATA for the fluid program's PDA (for that token)
 */
export type BaseToken = {
  name: string,
  symbol: SupportedTokens | "Select Token" | "Select FLUID"
  mintAddress: string,
  decimals?: number,
  pda: string,
}

/* for each Fluid token, we need the token mint address
 * fluid tokens don't require an ATA, since custody is never held
 */
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
    pda: "89B3rmx8nL7Zc2t6AhFEbC7g2bkzBZTGGdWEibLe3jBW"
  },
  {
    name: "Fluid USDC",
    symbol: "fUSDC",
    decimals: 6,
    mintAddress: "2XGVdHsAiMM9QDM9tV4fwQ2JnyWdSJaiXp2KifLJD1oa",
  },
]
