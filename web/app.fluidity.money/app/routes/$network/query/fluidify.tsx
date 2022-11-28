import { JsonRpcProvider } from "@ethersproject/providers";
import config, { colors } from "~/webapp.config.server";
import { json, LoaderFunction } from "@remix-run/node";
import AugmentedToken from "~/types/AugmentedToken";
import {
  getUsdUserMintLimit,
  userMintLimitedEnabled,
} from "~/util/chainUtils/ethereum/transaction";
import tokenAbi from "~/util/chainUtils/ethereum/Token.json";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  if (!network) throw new Error("Network not found");

  const ethereumWallets = config.config["ethereum"].wallets;

  const {
    config: {
      [network as string]: { tokens },
    },
  } = config;

  if (network === "ethereum") {
    const mainnetId = 0;

    const {
      drivers: {
        ethereum: {
          [mainnetId]: {
            rpc: { http: infuraUri },
          },
        },
      },
    } = config;

    const provider = new JsonRpcProvider(infuraUri);

    const augmentedTokens: AugmentedToken[] = await Promise.all(
      tokens.map(async (token) => {
        const { isFluidOf, address } = token;

        // Reverting has no mint limits
        if (isFluidOf) {
          return {
            ...token,
            userMintLimit: undefined,
            userTokenBalance: 0,
          };
        }

        const fluidPair = tokens.find(({ isFluidOf }) => isFluidOf === address);

        if (!fluidPair)
          throw new Error(`Could not find fluid Pair of ${token.name}`);

        const mintLimitEnabled = await userMintLimitedEnabled(
          provider,
          fluidPair.address,
          tokenAbi
        );

        const userMintLimit = mintLimitEnabled
          ? await getUsdUserMintLimit(provider, fluidPair.address, tokenAbi)
          : undefined;

        return {
          ...token,
          userMintLimit: userMintLimit,
          userTokenBalance: 0,
        };
      })
    );

    return json({
      network,
      tokens: augmentedTokens,
      ethereumWallets,
      colors: (await colors)[network as string],
    });
  }

  // Network === "solana"
  const augmentedTokens = await Promise.all(
    tokens.map(async (token) => {
      const { isFluidOf } = token;
      // const { name, symbol } = token;

      const mintLimit = isFluidOf
        ? // ?await userMintLimit(name)
          undefined
        : undefined;

      const tokensMinted = mintLimit
        ? // ?await userAmountMinted(symbol)
          0
        : 0;

      return {
        ...token,
        userMintLimit: mintLimit,
        userMintedAmt: tokensMinted,
        userTokenBalance: 0,
      };
    })
  );

  return json({
    network,
    tokens: augmentedTokens,
    ethereumWallets,
    colors: (await colors)[network as string],
  });
};
