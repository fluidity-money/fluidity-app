type Props = {
  fluid: boolean;

  symbol: string;
  name?: string;

  logo: string;

  stable?: true;

  mintCapPercentage?: number;

  amount: number;

  currentPrice?: string;

  address: string;

  color?: string;
  
  onClick: (symbol: string) => void;
};

const FluidifyCard = (props: Props) => {
  const { fluid, logo, name, symbol, amount, onClick, mintCapPercentage, color } = props;


  return (
    <div key={symbol} className={`fluidify-card`} onClick={() => onClick(symbol)}>
      <div className="fluidify-card--container">
        <img className={`fluidify-card-logo ${fluid ? "fluid-token-logo" : ""}`} src={logo} />
        <div className={""}>
          <span>{symbol}</span> <br />
          {fluid && <span>{name}</span>}
        </div>
        <div className={""}>
          <span>
            {amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
      </div>
      <div className="fluidify-card--progress-bar">
        <div className="fluidify-card--progress" style={{background: color, width: mintCapPercentage}} />
      </div>
    </div>
  );
};

export default FluidifyCard;
