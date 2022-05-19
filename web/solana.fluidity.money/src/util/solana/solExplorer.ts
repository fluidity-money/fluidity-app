export const solExplorer = (hash: string, type: "address" | "tx") => {
  if (process.env.REACT_APP_SOL_NETWORK === "devnet")
    return `https://explorer.solana.com/${type}/${hash}?cluster=devnet`;
  if (process.env.REACT_APP_SOL_NETWORK === "mainnet")
    return `https://explorer.solana.com/${type}/${hash}`;
};
