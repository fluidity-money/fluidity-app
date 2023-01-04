import type { Token } from "~/util/chainUtils/tokens";
import type BN from "bn.js";

type AugmentedToken = Token & {
  userMintLimit?: BN;
  userMintedAmt?: BN;
  userTokenBalance: BN;
};

export default AugmentedToken;
