interface IUtilityToken extends React.ImgHTMLAttributes<HTMLImageElement> {
  utility: string;
}

const UtilityToken = ({ utility, ...imgProps }: IUtilityToken) => {
  switch (utility) {
    case "chronos":
      return <img {...imgProps} src="https://app-cdn.fluidity.money/assets/tokens/fUSDC.svg" />;
    case "wombat":
      return <img {...imgProps} src="https://app-cdn.fluidity.money/images/providers/wombat.svg" />;
    case "sushi":
      return <img {...imgProps} src="https://app-cdn.fluidity.money/images/providers/Sushiswap.svg" />;
    case "trader_joe":
      return <img {...imgProps} src="https://app-cdn.fluidity.money/images/providers/trader_joe.svg" />;
    case "ramses":
      return <img {...imgProps} src="https://app-cdn.fluidity.money/images/providers/Ramses.svg" />;
    case "jumper":
      return <img {...imgProps} src="https://app-cdn.fluidity.money/images/providers/Jumper.svg" />;
    case "arb":
      return <img {...imgProps} src="https://app-cdn.fluidity.money/assets/chains/arbIcon.svg" />;
    case "lifi":
      return <img {...imgProps} src="https://app-cdn.fluidity.money/images/providers/Lifi.svg" />;
    default:
      return <img {...imgProps} src="https://app-cdn.fluidity.money/assets/tokens/fUSDC.svg" />;
  }
};

export { UtilityToken };
