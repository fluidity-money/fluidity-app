import Icon from "components/Icon";
import { decimalTrim } from "util/decimalTrim";

const CurrencyListing = ({currency, amount}: {currency: string; amount: string}) => {
  return (
    <div className="currency-listing-container">
      <Icon src={`currency-icon i-${currency}`} />
      <div className="currency-listing">
        <div>{currency}</div>
        <div>{decimalTrim(amount, 4)}</div>
      </div>
    </div>
  );
}

export default CurrencyListing;