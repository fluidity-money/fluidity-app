export type ChainName = 'ethereum' | 'solana' | 'arbitrum' | 'compound' | 'polygon'

interface Chain {
  short: SupportedChainsList;
  name: ChainName;
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
};
