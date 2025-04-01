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
  wETH: "Weth.svg",
  FLY: "fly.svg",
} as const;

type ITokenIcon = React.ImgHTMLAttributes<HTMLImageElement> & {
  token: Token
};

const TokenIcon = ({ token, className, ...props }: ITokenIcon) => (
  <img
    className={className}
    src={`${baseImgPath}/${tokenImgMap[token]}`}
    alt={token}
    {...props}
  />
);

export default TokenIcon;
