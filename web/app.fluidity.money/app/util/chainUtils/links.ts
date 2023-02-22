import type { Chain } from "./chains";

const getAddressExplorerLink = (chain: Chain, address: string) =>
  chain === "ethereum"
    ? `https://etherscan.io/address/${address}`
    : chain === "solana"
    ? `https://explorer.solana.com/address/${address}`
    : `https://arbiscan.io/address/${address}`;

// Ethereum only
const getBlockExplorerLink = (chain: Chain, block: number) =>
  chain === "ethereum"
    ? `https://etherscan.io/block/${block}`
    : chain === "solana"
    ? `https://explorer.solana.com/block/${block}`
    : `https://arbiscan.io/block/${block}`;

const getTxExplorerLink = (chain: Chain, address: string) =>
  chain === "ethereum"
    ? `https://etherscan.io/tx/${address}`
    : chain === "solana"
    ? `https://explorer.solana.com/tx/${address}`
    : `https://arbiscan.io/tx/${address}`;

const networkMapper = (network: string) => {
  switch (network) {
    case "ETH":
      return "ethereum";
    case "SOL":
      return "solana";
    case "ARB":
      return "arbitrum";
    case "ethereum":
      return "ETH";
    case "solana":
      return "SOL";
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
