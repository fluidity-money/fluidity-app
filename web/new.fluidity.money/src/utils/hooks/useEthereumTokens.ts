import localforage from "localforage";
import {useEffect, useRef, useState} from "react";
import {Network, SupportedFluidToken, SupportedUnwrappedToken} from "../../components/chains/ChainContext";
import {EthereumTokenConfig, FluidEthereumToken, UnwrappedEthereumToken} from "../ethereum/token";
import {removeOnUnload} from "../tokenCache";
import {Mapped} from "../types";

// defaults to ropsten
const importEthereumTokens = async(network: Network<"ethereum">): Promise<EthereumTokenConfig> => {
  switch (network) {
    case "mainnet":
      return (await import("../ethereum/config/mainnet-tokens.json"))
        .default;
    case "ropsten":
    default:
      return (await import("../ethereum/config/ropsten-tokens.json"))
        .default;
  }
};

type FluidTokenMap = Partial<Mapped<SupportedFluidToken<"ethereum">, FluidEthereumToken>>;
type UnwrappedTokenMap = Partial<Mapped<SupportedUnwrappedToken<"ethereum">, UnwrappedEthereumToken>>;
type TokenCache = {
  [K in Network<"ethereum">]?: {
    fluidTokens: FluidTokenMap, 
    unwrappedTokens: UnwrappedTokenMap, 
  }
}

export const useEthereumTokens = () => {
  // cache fetched tokens in a ref for network and chain switches
  const tokenCache  = useRef<TokenCache>({});
  const tokenCacheKey = "persist.tokenCache.ethereum";
  const [fluidTokens, setFluidTokens] = useState<FluidTokenMap>({});
  const [loading, setLoading] = useState(true);
  const [unwrappedTokens, setUnwrappedTokens] = useState<UnwrappedTokenMap>({});
  const [network, setNetwork] = useState<Network<"ethereum">>("mainnet");

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
      const {fluidTokens, unwrappedTokens} = cachedNetwork || {};

      if (fluidTokens && unwrappedTokens) {
        setFluidTokens(fluidTokens);
        setUnwrappedTokens(unwrappedTokens);
        return;
      }
    }

    importEthereumTokens(network).then((tokens: EthereumTokenConfig) => {
      const fluid_: FluidTokenMap = {};
      const unwrapped_: UnwrappedTokenMap = {};

      tokens.forEach(({symbol, name, address, decimals, colour, image}) => {
        if (symbol.startsWith('f'))
          fluid_[symbol as SupportedFluidToken<"ethereum">] = new FluidEthereumToken(
            symbol,
            name,
            address,
            decimals,
            colour,
            image,
          )
        else
          unwrapped_[symbol as SupportedUnwrappedToken<"ethereum">] = new UnwrappedEthereumToken(
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
        unwrappedTokens: unwrapped_,
        fluidTokens: fluid_,
      }

      setFluidTokens(fluid_);
      setUnwrappedTokens(unwrapped_);
    });
  }, [network]);

  return {fluidTokens, unwrappedTokens, network, setNetwork}
}
