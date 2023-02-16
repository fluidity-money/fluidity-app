import { useCache } from "~/hooks/useCache";
import { Application } from "~/queries/useApplicationRewardStatistics";

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

const providerNames: { [K in Application]: Providers } = {
  none: "Fluidity",
  uniswap_v2: "Uniswap",
  balancer_v2: "Balancer",
  oneinch_v1: "Oneinch",
  oneinch_v2: "Oneinch",
  oneinch_fixedrate: "Oneinch",
  mooniswap: "Mooniswap",
  dodo_v2: "Dodo",
  curve: "Curve",
  multichain: "Multichain",
  xy_finance: "XY Finance",

  spl: "Fluidity",
  saber: "Saber",
  orca: "Orca",
  raydium: "Raydium",
  aldrinv1: "Aldrin",
  aldrinv2: "Aldrin",
  lifinity: "Lifinity",
  mercurial: "Mercurial",
};

export const providerToDisplayName = (name: Application) => {
  return providerNames[name];
};

type IProviderIcon = {
  provider: Providers;
};

type Icons = { [K in Providers]: string };

const ProviderIcon = ({ provider }: IProviderIcon) => {
  const { data: icons } = useCache<Icons>("/query/providermeta");
  const icon = (icons && icons[provider]) || "/images/logoMetallic.png";

  return <img className="provider-img" src={icon} alt={provider} />;
};

export default ProviderIcon;
