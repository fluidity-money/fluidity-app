import Icon from "components/Icon";
import {useState} from "react";
import { decimalTrim } from "util/decimalTrim";

const CurrencyListing = ({currency, amount}: {currency: string; amount: string}) => {
  const [trim, setTrim] = useState(4);
  
  return (
    <div className="currency-listing-container"
    >
      <Icon src={`currency-icon i-${currency}`} />
      <div className="currency-listing">
        <div>{currency}</div>
        <div
          onMouseOver={() => setTimeout(() => setTrim(9), 40)}
          onMouseOut={() => setTimeout(() => setTrim(4), 40)}
        >
          {decimalTrim(amount, trim)}
        </div>
      </div>
    </div>
  );
}

export default CurrencyListing;
