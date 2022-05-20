import ChainId, { chainIdFromEnv } from "./chainId";

export const theme =
  chainIdFromEnv() === ChainId.AuroraMainnet ? "--aurora" : "";
