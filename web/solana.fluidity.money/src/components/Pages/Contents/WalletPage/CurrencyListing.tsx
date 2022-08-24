import Icon from "components/Icon";
import {useState} from "react";
import { decimalTrim } from "util/decimalTrim";
import { shorthandAmountFormatter } from "util/numbers";

const CurrencyListing = ({currency, amount}: {currency: string; amount: string}) => {
  const [trim, setTrim] = useState(3);
  return (
    <div className="currency-listing-container"
    >
      <Icon src={`currency-icon i-${currency}`} />
      <div className="currency-listing">
        <div className="currency-type">{currency}</div>
        <div title={amount}>
          {shorthandAmountFormatter(decimalTrim(amount, trim), trim)}
        </div>
      </div>
    </div>
  );
}

export default CurrencyListing;
