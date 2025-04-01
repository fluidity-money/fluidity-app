interface IUtilityToken extends React.ImgHTMLAttributes<HTMLImageElement> {
  utility: string;
}

const UtilityToken = ({ utility, ...imgProps }: IUtilityToken) => {
  switch (utility) {
    case "chronos":
      return <img {...imgProps} src="/assets/tokens/fUSDC.svg" />;
    case "wombat":
      return <img {...imgProps} src="/images/providers/wombat.svg" />;
    case "sushi":
      return <img {...imgProps} src="/images/providers/Sushiswap.svg" />;
    case "trader_joe":
      return <img {...imgProps} src="/images/providers/trader_joe.svg" />;
    case "ramses":
      return <img {...imgProps} src="/images/providers/Ramses.svg" />;
    case "jumper":
      return <img {...imgProps} src="/images/providers/Jumper.svg" />;
    case "arb":
      return <img {...imgProps} src="/assets/chains/arbIcon.svg" />;
    case "lifi":
      return <img {...imgProps} src="/images/providers/Lifi.svg" />;
    default:
      return <img {...imgProps} src="/assets/tokens/fUSDC.svg" />;
  }
};

export { UtilityToken };
