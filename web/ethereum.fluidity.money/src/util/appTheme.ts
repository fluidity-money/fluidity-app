import ChainId, { chainIdFromEnv } from "./chainId";

export const appTheme =
  chainIdFromEnv() === ChainId.AuroraMainnet ? "--aurora" : "";
