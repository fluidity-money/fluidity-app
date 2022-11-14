import type { Chain } from "./chains";

const getAddressExplorerLink = (chain: Chain, address: string) =>
  chain === "ethereum"
    ? `https://etherscan.io/address/${address}`
    : `https://explorer.solana.com/address/${address}`;

const getTxExplorerLink = (chain: Chain, address: string) =>
  chain === "ethereum"
    ? `https://etherscan.io/tx/${address}`
    : `https://explorer.solana.com/tx/${address}`;

const networkMapper = (network: string) => {
  switch (network) {
    case "ETH":
      return "ethereum";
    case "SOL":
      return "solana";
    case "ethereum":
      return "ETH";
    default:
      return "SOL";
  }
};

export { getAddressExplorerLink, getTxExplorerLink, networkMapper };
