interface Chain {
  short: string;
  name: string;
}

interface ISupportedChains {
  ETH: Chain;
  ARB: Chain;
  POLY_ZK: Chain;
  ZK_SYNC: Chain;
  SOL: Chain;
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
    short: "POLY ZK",
  },
  SOL: {
    name: "Solana",
    short: "SOL",
  },
  ZK_SYNC: {
    name: "ZkSync Era",
    short: "zkSync",
  },
};
