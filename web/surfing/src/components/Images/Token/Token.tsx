import style from "./Token.module.scss";

const baseImgPath = "https://static.fluidity.money/assets/tokens";

const tokenImgMap = {
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

export type Tokens = keyof typeof tokenImgMap;

type IToken = Partial<HTMLImageElement> & {
  token: Tokens;
};

const Token = ({ token, className }: IToken) => (
  <img
    className={className}
    src={`${baseImgPath}/${tokenImgMap[token]}`}
    alt={token}
  />
);

export default Token;
