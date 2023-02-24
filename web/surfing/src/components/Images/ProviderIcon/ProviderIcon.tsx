import style from "./ProviderIcon.module.scss";

export type Providers =
  | "Aave"
  | "Aldrin"
  | "Circle"
  | "Compound"
  | "Dodo"
  | "Jupiter"
  | "Lemniscap"
  | "Maker"
  | "Multicoin"
  | "Orca"
  | "Polygon"
  | "Saber"
  | "Solana"
  | "Solend"
  | "Uniswap"
  | "Sushiswap"
  | "Fluidity"
  | "Balancer"
  | "Oneinch"
  | "Mooniswap"
  | "Curve"
  | "Multichain"
  | "XY Finance"
  | "Raydium"
  | "Lifinity"
  | "Mercurial";

const baseImgPath = "https://static.fluidity.money/images/providers";

const getProviderImg = (provider: string) => {
  switch (provider)
  {
    case "Aave":
    case "aave":  
      return "aave-aave-logo.png"
    case "Aldrin":
    case "aldrin":
      return "Aldrin.svg"
    case "Circle":
    case "circle":
      return "circle-icon-inset-300.png"
    case "Compound":
    case "compound":
      return "Compound.svg"
    case "Dodo":
    case "dodo":
      return "DODO.png"
    case "Jupiter":
    case "jupiter":
      return "Jupiter.svg"
    case "Lemniscap":
    case "lemniscap":
      return "Lemniscap.png"
    case "Maker":
    case "maker":
      return "maker-mkr-logo.png"
    case "Multicoin":
    case "multicoin":
      return "Multicoin.png"
    case "Orca":
    case "orca":
      return "Orca.svg"
    case "Polygon":
    case "polygon":
      return "Polygon.svg"
    case "Saber":
    case "saber":
      return "Saber.svg"
    case "Solana":
    case "solana":
      return "Solana.svg"
    case "Solend":
    case "solend":
      return "solend.png"
    case "Uniswap":
    case "uniswap":
      return "Uniswap.svg"
    case "Sushiswap":
    case "sushiswap":
      return "Sushiswap.svg"
    case "Fluidity":
    case "fluidity":
      return "/images/logoMetallic.png"
    case "Oneinch":
    case "oneinch":
    case "1inch":
      return "1inch.svg"
    case "Balancer":
    case "balancer":
      return "balancer.svg"
    case "Mooniswap":
    case "mooniswap":
      return "mooniswap.png"
    case "Curve":
    case "curve":
      return "curve.png"
    case "Multichain":
    case "multichain":
      return "multichain.png"
    case "XY Finance":
    case "xy finance":
    case "xy":
      return "xy.png"
    case "Raydium":
    case "raydium":
      return "raydium.png"
    case "Lifinity":
    case "lifinity":
      return "lifinity.png"
    case "Mercurial":
    case "mercurial":
      return "mercurial.png"
    default:
      return "fluidity.png"
  }
}

type IProviderIcon = Partial<HTMLImageElement> & {
  provider: Providers;
};

const ProviderIcon = ({ provider, className }: IProviderIcon) => (
  <img
    className={`${style.provider} ${className}`}
    src={`${baseImgPath}/${getProviderImg(provider)}`}
    alt={provider}
  />
);

export default ProviderIcon;
