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
  
  addToken?: (symbol: string) => void;
};

const FluidifyCard = (props: Props) => {
  const { fluid, logo, name, symbol, amount, mintCapPercentage, color, addToken } = props;

  return (
    <div key={symbol} className={`fluidify-card`}>
      <div className="fluidify-card--container">
        {/* Logo & Name */}
        <div className="fluidify-card-left">
          <img
            className={`fluidify-card-logo ${fluid ? "fluid-token-logo" : ""}`}
            src={logo}
          />
          <div className={""}>
            <span>{symbol}</span> <br />
            {fluid && <span>{name}</span>}
          </div>
        </div>
        {/* Amount */}
        <div className={""}>
          <span>
            {amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
    <div />
          <button onClick={() => addToken?.(symbol)} title={"Add Token to Wallet"} className={"fluidify-card-add"}>
            +
          </button>
      </div>

      {/* Progress Bar */}
      <div className="fluidify-card--progress-bar">
        <div
          className="fluidify-card--progress"
          style={{
            background: `${color}`,
            transform: `scaleX(${mintCapPercentage || 0})`,
          }}
        />
      </div>
    </div>
  );
};

export default FluidifyCard;
