export type ChainName =
  | "ethereum"
  | "solana"
  | "arbitrum"
  | "compound"
  | "polygon";

interface Chain {
  short: SupportedChainsList;
  name: ChainName;
}

interface ISupportedChains {
  ETH: Chain;
  ARB: Chain;
  SOL: Chain;
}

export type SupportedChainsList = keyof ISupportedChains;

export const SupportedChains: ISupportedChains = {
  ETH: {
    name: "ethereum",
    short: "ETH",
  },
  ARB: {
    name: "arbitrum",
    short: "ARB",
  },
  SOL: {
    name: "solana",
    short: "SOL",
  },
};
