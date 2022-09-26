// dynamically import JSON from relevant config
import {useEffect, useRef, useState} from "react";
import {PublicKey} from "@solana/web3.js";
import {Network, SupportedFluidToken, SupportedUnwrappedToken} from "../../components/chains/ChainContext";
import {FluidSolanaToken, SolanaTokenConfig, UnwrappedSolanaToken} from "../solana/token";
import {Mapped} from "../types";

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
type TokenCache = {[K in Network<"solana">]?: {fluidTokens: FluidTokenMap, unwrappedTokens: UnwrappedTokenMap, fluidProgramId: PublicKey}}

export const useSolanaTokens = () => {
  // cache fetched tokens in a ref
  let {current: cache} = useRef<TokenCache>({});
  const [fluidTokens, setFluidTokens] = useState<FluidTokenMap>({});
  const [unwrappedTokens, setUnwrappedTokens] = useState<UnwrappedTokenMap>({});
  const [network, setNetwork] = useState<Network<"solana">>();
  const [fluidProgramId, setFluidProgramId] = useState<PublicKey>();

  useEffect(() => {
    if (!network)
      return;

    if (cache?.[network]) {
      const {[network]: cachedNetwork} = cache;
      if (cachedNetwork?.fluidTokens && cachedNetwork?.fluidProgramId && cachedNetwork?.unwrappedTokens) {
        setFluidProgramId(new PublicKey(cachedNetwork.fluidProgramId));
        setFluidTokens(cachedNetwork.fluidTokens);
        setUnwrappedTokens(cachedNetwork.unwrappedTokens);
        return;
      }
    }

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

      cache[network] = {
        fluidProgramId: new PublicKey(fluidProgramId),
        unwrappedTokens: unwrapped_,
        fluidTokens: fluid_,
      }

      setFluidProgramId(new PublicKey(fluidProgramId));
      setFluidTokens(fluid_);
      setUnwrappedTokens(unwrapped_);
    });
  }, [network]);

  return {fluidProgramId, fluidTokens, unwrappedTokens, network, setNetwork}
}
