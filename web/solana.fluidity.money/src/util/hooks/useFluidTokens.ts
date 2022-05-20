import {Network} from "@saberhq/solana-contrib";
import {
  networkToChainId,
  Token,
} from "@saberhq/token-utils";
import {TokenKind} from "components/types";
import {useEffect, useState} from "react";

export type TokenInfo = {
  // token is a class representing a Solana token 
  token: Token,
  // config contains information about that token
  config: {
    colour: string,
    image: string,
  }
}

// map of token names: info
export type FluidTokens = {
  [K in TokenKind["symbol"]]: TokenInfo;
}

// [{token1}, {token2}, ...]
export type FluidTokenList = Array<TokenInfo>

// dynamically import JSON from relevant config
// defaults to devnet
const importTokens = async(network: Network): Promise<TokenKind[]> => {
  switch (network) {
    case 'mainnet-beta':
      return (await import('config/mainnet-tokens.json')).default as TokenKind[];
    case 'devnet':
    default:
      return (await import('config/devnet-tokens.json')).default as TokenKind[];
  }
}

// a hook that provides an object containing a Token for each token we support.
// since token is declared as a class, we use a hook to not reinstantiate it across components.
// it also provides an array for all fluid tokens, and all base tokens
const useFluidTokens = () => {
  const [tokens, setTokens] = useState<FluidTokens | null>(null);
  const [fluidTokensList, setFluidTokens] = useState<FluidTokenList>([])
  const [nonFluidTokensList, setNonFluidTokens] = useState<FluidTokenList>([])

  const network =
    process.env.REACT_APP_SOL_NETWORK === "mainnet" ? "mainnet-beta" : "devnet";

  const chainId = networkToChainId(network);

  useEffect(() => {
    if (tokens) return;

    // import from JSON based on network
    importTokens(network).then(tokenList => {
      //map over the known list, using the token's symbol as a key
      const updatedList: FluidTokens = tokenList.reduce(
        (allTokens, {symbol, mintAddress, name, decimals, colour, image}) => ({
          ...allTokens,
          [symbol]: {
            token: new Token({
              chainId: chainId,
              address: mintAddress,
              name: name,
              symbol: symbol,
              decimals: decimals || 9,
            }),
            config: {
              colour,
              image,
            }
          },
        }),
        {} as FluidTokens
      );

      setTokens(updatedList);

      const fluidTokens_ = Object.entries(updatedList)
        .filter(([name]) => name.startsWith('f'))
        .map(([_name, value]) => value)

      setFluidTokens(fluidTokens_);

      const nonFluidTokens_ = Object.entries(updatedList)
        .filter(([name]) => !name.startsWith('f'))
        .map(([_name, value]) => value)

      setNonFluidTokens(nonFluidTokens_);
    });
  }, []);

  return {tokens, fluidTokensList, nonFluidTokensList};
};

export default useFluidTokens;
