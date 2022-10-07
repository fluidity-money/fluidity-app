import type { Chain } from "./chains";

const getAddressExplorerLink = (chain: Chain, address: string) =>
  chain === "ethereum"
    ? `https://etherscan.io/address/${address}`
    : `https://explorer.solana.com/address/${address}`;

export { getAddressExplorerLink };
