import { Provider } from "@fluidity-money/surfing";

export const getProviderDisplayName = (name?: string): Provider => {
  switch (name?.toLowerCase()) {
    case "aave":
      return "Aave";
    case "aldrin":
    case "aldrinv1":
    case "aldrinv2":
      return "Aldrin";
    case "camelot":
    case "camelot_v3":
      return "Camelot";
    case "chronos":
      return "Chronos";
    case "circle":
      return "Circle";
    case "compound":
      return "Compound";
    case "dodo":
    case "dodo_v2":
      return "Dodo";
    case "jupiter":
      return "Jupiter";
    case "lemniscap":
      return "Lemniscap";
    case "maker":
      return "Maker";
    case "multicoin":
      return "Multicoin";
    case "orca":
      return "Orca";
    case "polygon":
      return "Polygon";
    case "saber":
      return "Saber";
    case "saddle":
      return "Saddle";
    case "solana":
      return "Solana";
    case "solend":
      return "Solend";
    case "uniswap":
    case "uniswap_v3":
    case "uniswap_v2":
      return "Uniswap";
    case "sushiswap":
      return "Sushiswap";
    case "oneinch":
    case "1inch":
    case "oneinch_v1":
    case "oneinch_v2":
    case "oneinch_fixedrate":
      return "Oneinch";
    case "balancer":
    case "balancer_v2":
      return "Balancer";
    case "mooniswap":
      return "Mooniswap";
    case "curve":
      return "Curve";
    case "xy finance":
    case "xy":
    case "xy_finance":
      return "XY Finance";
    case "raydium":
      return "Raydium";
    case "lifinity":
      return "Lifinity";
    case "mercurial":
      return "Mercurial";
    case "ramses":
      return "Ramses";
    case "trader_joe":
      return "Trader Joe";
    case "jumper":
      return "Jumper";
    case "meteora":
      return "Meteora";
    case "lifi":
      return "Lifi";
    case "odos":
      return "Odos";
    case "fluidity":
    case "spl":
    case "none":
    default:
      return "Fluidity";
  }
};
