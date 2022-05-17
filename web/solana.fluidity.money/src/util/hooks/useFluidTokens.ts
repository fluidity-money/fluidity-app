import {
  networkToChainId,
  NETWORK_TO_CHAIN_ID,
  SOL,
  Token,
} from "@saberhq/token-utils";
import { TokenKind } from "components/types";
import { useEffect, useState } from "react";
import { tokenList } from "util/solana/constants";
import { SolTokenList } from "../solana/constants";

export type FluidTokens = { [K in TokenKind["type"]]: Token };

//a hook that provides an object containing a Token for each token we support.
//since token is declared as a class, we use a hook to not reinstantiate it across components
const useFluidTokens = () => {
  const [tokens, setTokens] = useState<FluidTokens | null>(null);

  const network =
    process.env.REACT_APP_SOL_NETWORK === "mainnet" ? "mainnet-beta" : "devnet";

  useEffect(() => {
    if (tokens) return;

    //map over the known list, using the token's symbol as a key
    const updatedList: FluidTokens = tokenList.reduce(
      (allTokens, { symbol, mintAddress, name, decimals }) => ({
        ...allTokens,
        [symbol]:
          symbol === "SOL"
            ? SOL[network]
            : new Token({
                chainId: NETWORK_TO_CHAIN_ID[network],
                // chainId: networkToChainId('localnet'),

                address: mintAddress,
                name: name,
                symbol: symbol,
                decimals: decimals || 9,
              }),
      }),
      {} as FluidTokens
    );

    setTokens(updatedList);
  }, []);

  return tokens;
};

export default useFluidTokens;
