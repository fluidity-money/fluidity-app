import {useEffect, useState} from "react";
import {Network, SupportedFluidToken, SupportedUnwrappedToken} from "../../components/chains/ChainContext";
import {EthereumTokenConfig, FluidEthereumToken, UnwrappedEthereumToken} from "../ethereum/token";
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

export const useEthereumTokens = () => {
  const [fluidTokens, setFluidTokens] = useState<FluidTokenMap>({});
  const [unwrappedTokens, setUnwrappedTokens] = useState<UnwrappedTokenMap>({});
  const [network, setNetwork] = useState<Network<"ethereum">>("mainnet");

  useEffect(() => {
    if (!network)
      return;
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

      setFluidTokens(fluid_);
      setUnwrappedTokens(unwrapped_);
    });
  }, [network]);

  return {fluidTokens, unwrappedTokens, network, setNetwork}
}
