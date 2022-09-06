interface Chain {
  short: SupportedChainsList;
  name: string;
}

interface ISupportedChains {
  ETH: Chain;
  SOL: Chain;
}

export type SupportedChainsList = keyof ISupportedChains

export const SupportedChains: ISupportedChains = {
  ETH: {
    name: "ethereum",
    short: "ETH",
  },
  SOL: {
    name: "solana",
    short: "SOL",
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
}

