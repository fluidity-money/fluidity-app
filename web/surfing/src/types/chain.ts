interface Chain {
  short: string;
  name: string;
}

interface ISupportedChains {
  ETH: Chain;
  ARB: Chain;
  POLY_ZK: Chain;
  SOL: Chain;
  SUI: Chain;
}

export type SupportedChainsList = keyof ISupportedChains;

export const SupportedChains: ISupportedChains = {
  ETH: {
    name: "Ethereum",
    short: "ETH",
  },
  ARB: {
    name: "Arbitrum",
    short: "ARB",
  },
  POLY_ZK: {
    name: "Polygon zkEVM",
    short: "ZkEVM",
  },
  SOL: {
    name: "Solana",
    short: "SOL",
  },
  SUI: {
    name: "Sui",
    short: "SUI",
  },
};
