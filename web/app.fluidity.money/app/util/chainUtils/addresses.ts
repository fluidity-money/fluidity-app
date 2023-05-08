import { isAddress } from "web3-utils";
import { chainType } from "~/util/chainUtils/chains";
import { PublicKey } from "@solana/web3.js";

const validAddress = (input: string, network: string): boolean => {
  try {
    return chainType(network) === "evm"
      ? isAddress(input)
      : PublicKey.isOnCurve(new PublicKey(input));
  } catch {
    return false;
  }
};

export { validAddress };
