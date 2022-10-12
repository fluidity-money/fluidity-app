// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
