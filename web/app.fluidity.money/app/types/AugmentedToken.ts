import { Token } from "~/util/chainUtils/tokens";

type AugmentedToken = Token & {
  userMintLimit?: number;
  userMintedAmt?: number;
  userTokenBalance: number;
};

export default AugmentedToken;
