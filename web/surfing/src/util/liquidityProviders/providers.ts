import { Provider } from "~/types";

const baseImgPath = "https://static.fluidity.money/images/providers";

export const getProviderImgPath = (provider: Provider) => {
  return `${baseImgPath}/${providerImgNames[provider]}`;
};

const providerImgNames: { [K in Provider]: string } = {
  Fluidity: "logoMetallic.png",
  Aave: "aave-aave-logo.png",
  Aldrin: "Aldrin.svg",
  Circle: "circle-icon-inset-300.png",
  Camelot: "Camelot.svg",
  Compound: "Compound.svg",
  Dodo: "DODO.png",
  Jupiter: "Jupiter.svg",
  Lemniscap: "Lemniscap.png",
  Maker: "maker-mkr-logo.png",
  Multicoin: "Multicoin.png",
  Orca: "Orca.svg",
  Polygon: "Polygon.svg",
  Saber: "Saber.svg",
  Saddle: "Saddle.svg",
  Solana: "Solana.svg",
  Solend: "solend.png",
  Uniswap: "Uniswap.svg",
  Sushiswap: "Sushiswap.svg",
  Balancer: "balancer.svg",
  Oneinch: "1inch.svg",
  Mooniswap: "mooniswap.png",
  Curve: "curve.png",
  Multichain: "multichain.png",
  "XY Finance": "xy.png",
  Raydium: "raydium.png",
  Lifinity: "lifinity.png",
  Mercurial: "mercurial.png",
};
