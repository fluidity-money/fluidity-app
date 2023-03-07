import style from "./Token.module.scss";
import type { Token } from "~/types";

const baseImgPath = "https://static.fluidity.money/assets/tokens";

const tokenImgMap: {[K in Token]: string} = {
  USDC: "usdc.svg",
  fUSDC: "fUSDC.svg",
  USDT: "usdt.svg",
  fUSDT: "fUSDT.svg",
  TUSD: "tusd.svg",
  fTUSD: "fTUSD.svg",
  FRAX: "frax.svg",
  fFRAX: "fFRAX.svg",
  DAI: "dai.svg",
  fDAI: "fDAI.svg",
} as const;

type ITokenIcon = Partial<HTMLImageElement> & {
  token: Token;
};

const TokenIcon = ({ token, className }: ITokenIcon) => (
  <img
    className={className}
    src={`${baseImgPath}/${tokenImgMap[token]}`}
    alt={token}
  />
);

export default TokenIcon;
