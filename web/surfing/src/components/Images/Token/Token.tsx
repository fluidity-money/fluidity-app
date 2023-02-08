import style from "./Token.module.scss";

export type Tokens =
  | "USDC"
  | "fUSDC"
  | "USDT"
  | "fUSDT"
  | "TUSD"
  | "fTUSD"
  | "FRAX"
  | "fFRAX"
  | "DAI"
  | "fDAI";

const baseImgPath = "https://static.fluidity.money/assets/tokens";

const tokenImgMap: { [K in Tokens]: string } = {
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
};

type IToken = Partial<HTMLImageElement> & {
  token: Tokens;
};

const Token = ({ token, className }: IToken) => (
  <img
    className={`${style.token} ${className}`}
    src={`${baseImgPath}/${tokenImgMap[token]}`}
    alt={token}
  />
);

export default Token;
