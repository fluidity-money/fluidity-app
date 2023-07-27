export type ChainName =
  | "ethereum"
  | "solana"
  | "arbitrum"
  | "compound"
  | "polygon_zk";

interface Chain {
  short: SupportedChainsList;
  name: ChainName;
}

interface ISupportedChains {
  ETH: Chain;
  ARB: Chain;
  POLY: Chain;
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
  POLY: {
    name: "polygon_zk",
    short: "POLY",
  },
  SOL: {
    name: "solana",
    short: "SOL",
  },
};
