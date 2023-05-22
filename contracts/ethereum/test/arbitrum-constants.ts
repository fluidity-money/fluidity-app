
import type { Token } from "../types";

export const USDC_ADDR = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8";
export const AUSDC_ADDR = "0x625E7708f30cA75bfd92586e17077590C60eb4cD";
export const USDC_HOLDER = "0x62383739d68dd0f844103db8dfb05a7eded5bbe6";

export const USDT_ADDR = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9";
export const AUSDT_ADDR = "0x6ab707aca953edaefbc4fd23ba73294241490620";
export const USDT_HOLDER = "0x62383739d68dd0f844103db8dfb05a7eded5bbe6";

export const DAI_ADDR = "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1";
export const ADAI_ADDR = "0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC";
export const DAI_HOLDER = "0xd85e038593d7a098614721eae955ec2022b9b91b";

export const CAMELOT_FACTORY = "0x6EcCab422D763aC031210895C81787E87B43A652";

export const CAMELOT_ROUTER = "0xc873fEcbd354f5A56E00E710B90EF4201db2448d";

export const SUSHISWAP_MASTER_DEPLOYER = "0xf0e1f962e3e6d8e2af8190b2798c1b4f018fe48d";

export const SUSHISWAP_STABLE_POOL_FACTORY = "0xc2fB256ABa36852DCcEA92181eC6b355f09A0288";

export const SUSHISWAP_BENTO_BOX = "0x74c764d41b77dbbb4fe771dab1939b00b146894a";

export const USUAL_FUSDC_ADDR = "0x4CFA50B7Ce747e2D61724fcAc57f24B748FF2b2A";

export const CAMELOT_FUSDC_USDC_PAIR = "0x1Cb94adFd3314d48Ca8145b2c6983419257c0486";

export const CAMELOT_FUSDC_WETH_PAIR = "0x85DF70e1636D28AB29bB81dF93B68834F4308750";

export const SUSHISWAP_FUSDC_USDC_POOL = "0xa7f8207bbea17e44cdc5238cb03c03eacefba314";

export const SUSHISWAP_FUSDC_WETH_POOL = "0x85DF70e1636D28AB29bB81dF93B68834F4308750";

export const USUAL_LOOTBOX_STAKING = "0x770f77A67d9B1fC26B80447c666f8a9aECA47C82";

export const WETH_ADDR = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";

const tokens = {
  "usdc": {
    backend: "aaveV3",
    aaveAddress: AUSDC_ADDR,
    decimals: 6,
    symbol: "fUSDC",
    name: "udsc",
    address: USDC_ADDR,
    owner: USDC_HOLDER,
  },
  "usdt": {
    backend: "aaveV3",
    aaveAddress: AUSDT_ADDR,
    decimals: 6,
    symbol: "fUSDT",
    name: "usdt",
    address: USDT_ADDR,
    owner: USDT_HOLDER,
  },
  "dai": {
    backend: "aaveV3",
    aaveAddress: ADAI_ADDR,
    decimals: 18,
    symbol: "fDAI",
    name: "dai",
    address: DAI_ADDR,
    owner: DAI_HOLDER,
  }
} as const;

export const TokenList: {[k in keyof typeof tokens]: Token} = tokens;
