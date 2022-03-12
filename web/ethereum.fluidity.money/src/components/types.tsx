export type SupportedTokens = "USDC" | "USDT" | "DAI" | "TUSD";
export type FluidSupportedTokens = `f${SupportedTokens}`
export type Token = SupportedTokens | FluidSupportedTokens

//for selector component
export type TokenKind = {
    type: Token | "Select Token" | "Select FLUID"
    src: string;
    colour: string;
};

export interface TokenList {
    kind: TokenKind[];
}
