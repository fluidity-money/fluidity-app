export type Chain = "solana" | "arbitrum" | "sui";
export type ChainType = "evm" | "solana" | "sui";

const chainType = (network: string): ChainType | undefined => {
  switch (network) {
    case "arbitrum":
      return "evm";
    case "solana":
      return "solana";
    case "sui":
      return "sui";
    default:
      return undefined;
  }
};

const getChainId = (network: Chain): number => {
  switch (network) {
    case "arbitrum":
      return 42161;
    case "solana":
      return 1;
    case "sui":
      return 1;
  }
};

const getNetworkFromChainId = (
  chainId_: string | number
): Chain | undefined => {
  const chainId =
    typeof chainId_ === "string" ? parseInt(chainId_, 16) : chainId_;

  switch (chainId) {
    case 42161:
      return "arbitrum";
  }
};

const getChainNativeToken = (network: string): string => {
  switch (network) {
    case "arbitrum":
      return "ETH";
    case "solana":
      return "SOL";
    case "sui":
      return "SUI";
    default:
      return "";
  }
};

export { chainType, getChainId, getChainNativeToken, getNetworkFromChainId };
