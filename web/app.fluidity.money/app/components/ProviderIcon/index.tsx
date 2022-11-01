import { useLoaderData } from "@remix-run/react";
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
  | "Sushiswap";

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
