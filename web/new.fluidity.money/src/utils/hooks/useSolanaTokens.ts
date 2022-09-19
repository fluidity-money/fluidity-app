// dynamically import JSON from relevant config
import {useEffect, useState} from "react";
import {PublicKey} from "@solana/web3.js";
import {Network, SupportedFluidToken, SupportedUnwrappedToken} from "../../chainContext";
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

// TODO try to source from localforage on first load
export const useSolanaTokens = () => {
  const [fluidTokens, setFluidTokens] = useState<FluidTokenMap>({});
  const [unwrappedTokens, setUnwrappedTokens] = useState<UnwrappedTokenMap>({});
  const [network, setNetwork] = useState<Network<"solana">>();
  const [fluidProgramId, setFluidProgramId] = useState<PublicKey>();

  useEffect(() => {
    if (!network)
      return;
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

      setFluidProgramId(new PublicKey(fluidProgramId));
      setFluidTokens(fluid_);
      setUnwrappedTokens(unwrapped_);
    });
  }, [network]);

  return {fluidProgramId, fluidTokens, unwrappedTokens, network, setNetwork}
}
