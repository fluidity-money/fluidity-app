export type Chain = "ethereum" | "solana" | "arbitrum";
export type ChainType = "evm" | "solana";

const chainType = (network: string): ChainType | undefined => {
  switch (network) {
    case "ethereum":
    case "arbitrum":
      return "evm";
    case "solana":
      return "solana";
    default:
      return undefined;
  }
};

const getChainId = (network: Chain): number => {
  switch (network) {
    case "ethereum":
      return 1;
    case "arbitrum":
      return 42161;
    case "solana":
      return 1;
  }
};

const getNetworkFromChainId = (
  chainId_: string | number
): Chain | undefined => {
  const chainId =
    typeof chainId_ === "string" ? parseInt(chainId_, 16) : chainId_;

  switch (chainId) {
    case 1:
      return "ethereum";
    case 42161:
      return "arbitrum";
  }
};

const getChainNativeToken = (network: string): string => {
  switch (network) {
    case "ethereum":
    case "arbitrum":
      return "ETH";
    case "solana":
      return "SOL";
    default:
      return "";
  }
};

export { chainType, getChainId, getChainNativeToken, getNetworkFromChainId };
