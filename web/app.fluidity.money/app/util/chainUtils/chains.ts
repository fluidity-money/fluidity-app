export type Chain = "ethereum" | "solana" | "arbitrum";
export type ChainType = "evm" | "solana";

const chainType = (chain: string): ChainType | undefined =>
  chain === "ethereum" || chain === "arbitrum" ?
    "evm" :
  chain === "solana" ?
    "solana" :
  undefined

// the name Moralis uses to determine which chain to use
// passed via a paramter
const moralisChains: {[K in Chain]?: string}= {
  "ethereum": "0x1",
  "arbitrum": "arbitrum"
}

const resolveMoralisChainName = (chain: Chain) => {
  return moralisChains[chain];
}


export {
  chainType,
  resolveMoralisChainName,
};
