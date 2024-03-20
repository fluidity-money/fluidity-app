import type { Chain } from "./chains";

const getAddressExplorerLink = (chain: Chain, address: string): string => {
  switch (chain) {
    case "solana":
      return `https://explorer.solana.com/address/${address}`;
    case "arbitrum":
      return `https://arbiscan.io/address/${address}`;
    case "sui":
      return `https://suiscan.xyz/mainnet/account/${address}`;
  }
};

// Ethereum only
const getBlockExplorerLink = (chain: Chain, block: number): string => {
  switch (chain) {
    case "solana":
      return `https://explorer.solana.com/block/${block}`;
    case "arbitrum":
      return `https://arbiscan.io/block/${block}`;
    case "sui":
      return `https://suiscan.xyz/mainnet/checkpoint/${block}`;
  }
};

const getTxExplorerLink = (chain: Chain, address: string): string => {
  switch (chain) {
    case "solana":
      return `https://explorer.solana.com/tx/${address}`;
    case "arbitrum":
      return `https://arbiscan.io/tx/${address}`;
    case "sui":
      return `https://suiscan.xyz/mainnet/tx/${address}`;
  }
};

const networkMapper = (network: string) => {
  switch (network) {
    case "SOL":
      return "solana";
    case "solana":
      return "SOL";
    case "ARB":
      return "arbitrum";
    case "SUI":
      return "sui";
    case "arbitrum":
      return "ARB";
    case "sui":
      return "SUI";
    default:
      return "ETH";
  }
};

export {
  getAddressExplorerLink,
  getTxExplorerLink,
  getBlockExplorerLink,
  networkMapper,
};
