export type Chain = "ethereum" | "solana" | "arbitrum";
export type ChainType = "evm" | "solana";

const chainType = (network: string): ChainType | undefined => {
  switch (network) {
    case "ethereum":
    case "arbitrum":
      return "evm"
    case "solana":
      return "solana"
    default:
      return undefined
  }
};

export {
  chainType,
};
