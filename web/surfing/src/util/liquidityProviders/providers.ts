import { Provider } from "~/types";

const baseImgPath = "https://static.fluidity.money/images/providers";

export const getProviderImgPath = (provider: Provider) => {
  return `${baseImgPath}/${providerImgNames[provider]}`;
};

const providerImgNames: { [K in Provider]: string } = {
  Aave: "aave-aave-logo.png",
  Aldrin: "Aldrin.svg",
  Balancer: "balancer.svg",
  Camelot: "Camelot.svg",
  Chronos: "chronos.webp",
  Circle: "circle-icon-inset-300.png",
  Compound: "Compound.svg",
  Curve: "curve.png",
  Dodo: "DODO.png",
  Fluidity: "logoMetallic.png",
  Jumper: "Jumper.svg",
  Lifi: "Lifi.svg",
  Jupiter: "Jupiter.svg",
  Kyber: "Kyber.svg",
  Lemniscap: "Lemniscap.png",
  Lifinity: "lifinity.png",
  Maker: "maker-mkr-logo.png",
  Mercurial: "mercurial.png",
  Mooniswap: "mooniswap.png",
  Multicoin: "Multicoin.png",
  Oneinch: "1inch.svg",
  Orca: "Orca.svg",
  Polygon: "Polygon.svg",
  Ramses: "Ramses.svg",
  Raydium: "raydium.png",
  Saber: "Saber.svg",
  Saddle: "Saddle.svg",
  Solana: "Solana.svg",
  Solend: "solend.png",
  Sushiswap: "Sushiswap.svg",
  "Trader Joe": "trader_joe.svg",
  Uniswap: "Uniswap.svg",
  "XY Finance": "xy.png",
  "Meteora": "Meteora.svg"
};
