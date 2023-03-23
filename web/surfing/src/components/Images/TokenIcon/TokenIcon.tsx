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
  token: Token
  style?: React.CSSProperties
};

const TokenIcon = ({ token, className, style }: ITokenIcon) => (
  <img
    style={style}
    className={className}
    src={`${baseImgPath}/${tokenImgMap[token]}`}
    alt={token}
  />
);

export default TokenIcon;
