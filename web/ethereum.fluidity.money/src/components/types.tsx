export type SupportedTokens = "USDC" | "USDT" | "DAI" | "TUSD" | "Fei";
export type FluidSupportedTokens = `f${SupportedTokens}`;
export type Token = SupportedTokens | FluidSupportedTokens;

//for selector component
export type TokenKind = {
  symbol: Token | "Select Token" | "Select FLUID";
  image: string;
  colour: string;
  address: string;
  decimals: number;
};

export interface TokenList {
  kind: TokenKind[];
}
