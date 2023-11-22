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
    case "trader":
      return <img {...imgProps} src="/assets/chains/arbIcon.svg" />;
    default:
      return <img {...imgProps} src="/assets/tokens/fUSDC.svg" />;
  }
};

export { UtilityToken };
