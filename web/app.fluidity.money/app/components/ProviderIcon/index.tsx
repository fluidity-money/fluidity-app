import { useLoaderData } from "@remix-run/react";
import { Application } from "~/queries/useApplicationRewardStatistics";
import config from "~/webapp.config.server";

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

type LoaderData = {
  icons: typeof config.provider_icons;
};

const ProviderIcon = ({ provider }: IProviderIcon) => {
  const { icons } = useLoaderData<LoaderData>();
  return <img className="provider-img" src={icons[provider]} alt="" />;
};

export default ProviderIcon;
