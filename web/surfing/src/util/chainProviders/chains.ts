interface Chain {
  short: SupportedChainsList;
  name: string;
}

interface ISupportedChains {
  ETH: Chain;
  SOL: Chain;
  ARB: Chain;
}

export type SupportedChainsList = keyof ISupportedChains;

export const SupportedChains: ISupportedChains = {
  ETH: {
    name: "ethereum",
    short: "ETH",
  },
  SOL: {
    name: "solana",
    short: "SOL",
  },
  ARB: {
    name: "arbitrum",
    short: "ARB",
  },
  // Unused
  // CMPD = {
  //   name: "compound",
  //   short: "CMPD"
  // },
  // POL = {
  //   name: "polygon",
  //   short: "POL"
  // },
};
