
import type { Token } from "./types";

export const USDT_ADDR = "0xdac17f958d2ee523a2206206994597c13d831ec7";
export const CUSDT_ADDR = "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9";
export const AUSDT_ADDR = "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811";
export const USDT_HOLDER = "0xf977814e90da44bfa03b6295a0616a897441acec";

export const USDC_ADDR = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
export const CUSDC_ADDR = "0x39aa39c021dfbae8fac545936693ac917d5e7563";
export const USDC_HOLDER = "0x6262998ced04146fa42253a5c0af90ca02dfd2a3";

export const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
export const CDAI_ADDR = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
export const DAI_HOLDER = "0x28c6c06298d514db089934071355e5743bf21d60";

export const TUSD_ADDR = "0x0000000000085d4780B73119b644AE5ecd22b376";
export const CTUSD_ADDR = "0x12392f67bdf24fae0af363c24ac620a2f67dad86";
export const TUSD_HOLDER = "0x3ddfa8ec3052539b6c9549f12cea2c295cff5296";

export const FEI_ADDR = "0x956F47F50A910163D8BF957Cf5846D573E7f87CA";
export const AFEI_ADDR = "0x683923dB55Fead99A79Fa01A27EeC3cB19679cC3";
export const FEI_HOLDER = "0x3a24fea1509e1baeb2d2a7c819a191aa441825ea";

export const WETH_ADDR = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const AWETH_ADDR = "0x030ba81f1c18d280636f32af80b9aad02cf0854e";
export const WETH_HOLDER = "0x57757e3d981446d585af0d9ae4d7df6d64647806";

export const USUAL_FUSDT_ADDR = "0xaE950EEcB370371faa8BAf150f1acBF804051a5f";
export const USUAL_FUSDC_ADDR = "0x0094D1019251793dB2100026736ee267946B5FA4";
export const USUAL_FDAI_ADDR = "0xA5F816E2dE025A1bb419eD59652Fa03F249369A9";
export const USUAL_FTUSD_ADDR = "0xD3a3C51BD460aCE0E83506CD1191Cf77F5eC3415";
export const USUAL_FFEI_ADDR = "0xF24B32ec321e99053809f52aEbF680F70FE0dc53";
export const USUAL_FETH_ADDR = "0x4Fe3f5FBAfaDD97E103F6DCc562E39F196afddF9";

export const AAVE_V2_POOL_PROVIDER_ADDR = '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5';

const tokens = {
  "usdt": {
    backend: "compound",
    compoundAddress: CUSDT_ADDR,
    decimals: 6,
    name: "Fluid USDT",
    symbol: "fUSDT",
    address: USDT_ADDR,
    owner: USDT_HOLDER
  },
  "usdc": {
    backend: "compound",
    compoundAddress: CUSDC_ADDR,
    decimals: 6,
    name: "Fluid USDC",
    symbol: "fUSDC",
    address: USDC_ADDR,
    owner: USDC_HOLDER
  },
  "dai": {
    backend: "compound",
    compoundAddress: CDAI_ADDR,
    decimals: 18,
    name: "Fluid DAI",
    symbol: "fDAI",
    address: DAI_ADDR,
    owner: DAI_HOLDER
  },
  "tusd": {
    backend: "compound",
    compoundAddress: CTUSD_ADDR,
    decimals: 18,
    name: "Fluid tUSD",
    symbol: "ftUSD",
    address: TUSD_ADDR,
    owner: TUSD_HOLDER
  },
  "fei": {
    backend: "aaveV2",
    aaveAddress: AFEI_ADDR,
    decimals: 18,
    name: "Fluid Fei",
    symbol: "fFEI",
    address: FEI_ADDR,
    owner: FEI_HOLDER
  },
  "weth": {
    backend: "aaveV2",
    aaveAddress: AWETH_ADDR,
    decimals: 18,
    name: "Fluid WETH",
    symbol: "fwETH",
    address: WETH_ADDR,
    owner: WETH_HOLDER
  }
} as const;

export const TokenList: {[k in keyof typeof tokens]: Token} = tokens;