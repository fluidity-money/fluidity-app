// dynamically import JSON from relevant config
import {useEffect, useRef, useState} from "react";
import {PublicKey} from "@solana/web3.js";
import {Network, SupportedFluidToken, SupportedUnwrappedToken} from "../../components/chains/ChainContext";
import {FluidSolanaToken, SolanaTokenConfig, UnwrappedSolanaToken} from "../solana/token";
import {Mapped} from "../types";
import localforage from "localforage";
import {removeOnUnload} from "../tokenCache";

// defaults to devnet
const importSolanaTokens = async(network: Network<"solana">): Promise<SolanaTokenConfig> => {
  switch (network) {
    case "mainnet-beta":
      return (await import("../solana/config/mainnet-tokens.json"))
        .default;
    case "devnet":
    default:
      return (await import("../solana/config/devnet-tokens.json"))
        .default;
  }
};

type FluidTokenMap = Partial<Mapped<SupportedFluidToken<"solana">, FluidSolanaToken>>;
type UnwrappedTokenMap = Partial<Mapped<SupportedUnwrappedToken<"solana">, UnwrappedSolanaToken>>;
type TokenCache = {
  [K in Network<"solana">]?: {
    fluidTokens: FluidTokenMap, 
    unwrappedTokens: UnwrappedTokenMap, 
    fluidProgramId: PublicKey
  }
}

export const useSolanaTokens = () => {
  // cache fetched tokens in a ref for network and chain switches
  const tokenCache  = useRef<TokenCache>({});
  const tokenCacheKey = "persist.tokenCache.solana";
  const [fluidTokens, setFluidTokens] = useState<FluidTokenMap>({});
  const [loading, setLoading] = useState(true);
  const [unwrappedTokens, setUnwrappedTokens] = useState<UnwrappedTokenMap>({});
  const [network, setNetwork] = useState<Network<"solana">>("mainnet-beta");
  const [fluidProgramId, setFluidProgramId] = useState<PublicKey>();

  // clear cache on page reset, to avoid becoming stale
  useEffect(() => {
    return removeOnUnload();
  }, []);

  // fetch and set tokens from cache if exists
  useEffect(() => {
    localforage.getItem(tokenCacheKey).then((localCache: any) => {
      if (localCache && Object.keys(localCache).length > 0) {
        tokenCache.current = localCache;
        localforage.removeItem(tokenCacheKey)
      };
    }).finally(() => {
      setLoading(false)
    });
    // set cache on component unmount
    return (() => {
      if (Object.keys(tokenCache.current).length > 0) {
        localforage.setItem(tokenCacheKey, tokenCache.current);
      }
    })
  }, [])


  useEffect(() => {
    if (!network || loading)
      return;

    // load from cache if possible
    if (tokenCache.current?.[network]) {
      const {[network]: cachedNetwork} = tokenCache.current;
      const {fluidTokens, fluidProgramId, unwrappedTokens} = cachedNetwork || {};

      if (fluidTokens && fluidProgramId && unwrappedTokens) {
        setFluidProgramId(new PublicKey(fluidProgramId));
        setFluidTokens(fluidTokens);
        setUnwrappedTokens(unwrappedTokens);
        return;
      }
    }

    // otherwise import from JSON
    importSolanaTokens(network).then((config: SolanaTokenConfig) => {
      const fluid_: FluidTokenMap = {};
      const unwrapped_: UnwrappedTokenMap = {};
      const {fluidProgramId, tokens} = config;

      tokens.forEach(({symbol, name, address, decimals, colour, image, ...token}) => {
        if (token.obligationAccount && token.dataAccount)
          unwrapped_[symbol as SupportedUnwrappedToken<"solana">] = new UnwrappedSolanaToken(
            symbol,
            name,
            address,
            decimals,
            colour,
            image,
            new PublicKey(token.obligationAccount),
            new PublicKey(token.dataAccount),
          )
        else
          fluid_[symbol as SupportedFluidToken<"solana">] = new FluidSolanaToken(
            symbol,
            name,
            address,
            decimals,
            colour,
            image,
          )
      });

      // update the cache
      tokenCache.current[network] = {
        fluidProgramId: new PublicKey(fluidProgramId),
        unwrappedTokens: unwrapped_,
        fluidTokens: fluid_,
      }

      setFluidProgramId(new PublicKey(fluidProgramId));
      setFluidTokens(fluid_);
      setUnwrappedTokens(unwrapped_);
    });
  }, [network, loading]);

  return {fluidProgramId, fluidTokens, unwrappedTokens, network, setNetwork}
}
