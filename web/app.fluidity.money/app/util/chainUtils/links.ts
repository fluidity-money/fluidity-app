import type { Chain } from "./chains";

const getAddressExplorerLink = (chain: Chain, address: string): string => {
  switch (chain) {
    case "solana":
      return `https://explorer.solana.com/address/${address}`;
    case "arbitrum":
      return `https://arbiscan.io/address/${address}`;
    case "polygon_zk":
      return `https://zkevm.polygonscan.io/address/${address}`;
    case "sui":
      return `https://suiexplorer.com/address/${address}`;
  }
};

// Ethereum only
const getBlockExplorerLink = (chain: Chain, block: number): string => {
  switch (chain) {
    case "solana":
      return `https://explorer.solana.com/block/${block}`;
    case "arbitrum":
      return `https://arbiscan.io/block/${block}`;
    case "polygon_zk":
      return `https://zkevm.polygonscan.io/block/${block}`;
    case "sui":
      return `https://suiexplorer.com/checkpoint/${block}`;
  }
};

const getTxExplorerLink = (chain: Chain, address: string): string => {
  switch (chain) {
    case "solana":
      return `https://explorer.solana.com/tx/${address}`;
    case "arbitrum":
      return `https://arbiscan.io/tx/${address}`;
    case "polygon_zk":
      return `https://zkevm.polygonscan.io/tx/${address}`;
    case "sui":
      return `https://suiexplorer.com/txblock/${address}`;
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
    case "POLY_ZK":
      return "polygon_zk";
    case "polygon_zk":
      return "POLY_ZK";
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
