import type { Chain } from "./chains";

const getAddressExplorerLink = (chain: Chain, address: string): string => {
  switch (chain) {
    case "solana":
      return `https://explorer.solana.com/address/${address}`;
    case "arbitrum":
      return `https://arbiscan.io/address/${address}`;
  }
};

// Ethereum only
const getBlockExplorerLink = (chain: Chain, block: number): string => {
  switch (chain) {
    case "solana":
      return `https://explorer.solana.com/block/${block}`;
    case "arbitrum":
      return `https://arbiscan.io/block/${block}`;
  }
};

const getTxExplorerLink = (chain: Chain, address: string): string => {
  switch (chain) {
    case "solana":
      return `https://explorer.solana.com/tx/${address}`;
    case "arbitrum":
      return `https://arbiscan.io/tx/${address}`;
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
    case "arbitrum":
      return "ARB";
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
