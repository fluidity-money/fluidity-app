import { Application } from "~/queries/useApplicationRewardStatistics";
import { Providers } from "~/types/Provider";

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