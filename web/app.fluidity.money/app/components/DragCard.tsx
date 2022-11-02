import { useDrag } from "react-dnd";

import ItemTypes from "~/types/ItemTypes";

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
};

const DragCard = (props: Props) => {
  const { fluid, logo, name, symbol, amount } = props;

  const [{ isDragging }, drag] = useDrag(() => {
    return {
      type: fluid ? ItemTypes.FLUID_ASSET : ItemTypes.ASSET,
      item: {
        ...props,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    };
  });

  return (
    <div ref={drag} key={symbol} className={`fluidify-card`}>
      <div className="fluidify-card--container">
        <img src={logo} />
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
        <div className="fluidify-card--progress" />
      </div>
    </div>
  );
};

export default DragCard;
