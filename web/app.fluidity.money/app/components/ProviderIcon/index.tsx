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
  | "Sushiswap";

const providerIconUrlMap: { [P in Providers]: string } = {
  Aave: "/images/providers/aave-aave-logo.png",
  Aldrin: "/images/providers/Aldrin.svg",
  Circle: "/images/providers/circle-icon-inset-300.png",
  Compound: "/images/providers/Compound.svg",
  Dodo: "/images/providers/DODO.png",
  Jupiter: "/images/providers/Jupiter.svg",
  Lemniscap: "/images/providers/Lemniscap.png",
  Maker: "/images/providers/maker-mkr-logo.png",
  Multicoin: "/images/providers/Multicoin.png",
  Orca: "/images/providers/Orca.svg",
  Polygon: "/images/providers/Polygon.svg",
  Saber: "/images/providers/saber.svg",
  Solana: "/images/providers/Solana.svg",
  Solend: "/images/providers/solend.png",
  Uniswap: "/images/providers/Uniswap.svg",
  Sushiswap: "/images/providers/Sushiswap.svg",
};

type IProviderIcon = {
  provider: Providers;
};

const ProviderIcon = ({ provider }: IProviderIcon) => (
  <img className="provider-img" src={providerIconUrlMap[provider]} alt="" />
);

export default ProviderIcon;
