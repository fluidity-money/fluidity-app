export type SupportedTokens = "USDC" | "USDT" | "DAI" | "UXD" | "UST";
export type FluidSupportedTokens = `f${SupportedTokens}`
export type Token = SupportedTokens | FluidSupportedTokens

//for selector component
export type TokenKind = {
  symbol: Token | "Select Token" | "Select FLUID";
  name: string;
  image: string;
  colour: string;
  mintAddress: string;
  decimals: number;
  obligationAccount: string;
  dataAccount: string;
  //amount: string;
  //pinned: boolean;
};

export interface TokenList {
    kind: TokenKind[];
}
