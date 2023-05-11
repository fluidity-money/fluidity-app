
import type { Token } from "../types";

export const USDC_ADDR = "0xa2025b15a1757311bfd68cb14eaefcc237af5b43";
export const AUSDC_ADDR = "0x1Ee669290939f8a8864497Af3BC83728715265FF";
export const USDC_HOLDER = "0xeb2962b62c44138bbe094f2ff5a41e5c17152630";

export const AAVE_V3_GOERLI_POOL_PROVIDER_ADDR = '0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D';

const tokens = {
  "usdc": {
    backend: "aaveV3",
    aaveAddress: AUSDC_ADDR,
    decimals: 6,
    symbol: "fUSDC",
    name: "usdc",
    address: USDC_ADDR,
    owner: USDC_HOLDER,
  },
} as const;

export const TokenList: {[k in keyof typeof tokens]: Token} = tokens;
