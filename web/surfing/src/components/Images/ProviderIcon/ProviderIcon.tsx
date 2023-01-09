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

const providerImgMap: { [K in Providers]: string } = {
  "Aave": "aave-aave-logo.png",
  "Aldrin": "Aldrin.svg",
  "Circle": "circle-icon-inset-300.png",
  "Compound": "Compound.svg",
  "Dodo": "DODO.png",
  "Jupiter": "Jupiter.svg",
  "Lemniscap": "Lemniscap.png",
  "Maker": "maker-mkr-logo.png",
  "Multicoin": "Multicoin.png",
  "Orca": "Orca.svg",
  "Polygon": "Polygon.svg",
  "Saber": "Saber.svg",
  "Solana": "Solana.svg",
  "Solend": "solend.png",
  "Uniswap": "Uniswap.svg",
  "Sushiswap": "Sushiswap.svg",
  "Fluidity": "/images/logoMetallic.png",
  "Oneinch": "1inch.svg",
  "Balancer": "balancer.svg",
  "Mooniswap":"mooniswap.png",
  "Curve":"curve.png",
  "Multichain":"multichain.png",
  "XY Finance":"xy_finance.png",
  "Raydium":"raydium.png",
  "Lifinity":"lifinity.png",
  "Mercurial":"mercurial.png",
};

type IProviderIcon = HTMLImageElement & {
  provider: Providers;
};

const ProviderIcon = ({ provider, className }: IProviderIcon) => 
  <img className={`${style.provider} ${className}`} src={`${baseImgPath}/${providerImgMap[provider]}`} alt={provider} />

export default ProviderIcon;

