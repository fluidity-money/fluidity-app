export const solExplorer = (hash: string, type: 'address' | 'tx') => {
  return `https://explorer.solana.com/${type}/${hash}?cluster=devnet`;
}
