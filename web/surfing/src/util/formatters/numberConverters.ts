// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

const numberToCommaSeparated = (num: number): string => {
  const wholeValues = Math.floor(num);

  const numCommas = Math.max(Math.floor(Math.log(wholeValues) / Math.log(1000)) + 1, 1);
  const commaValues = Array.from(
    {length: numCommas},
    (_, i) => Math.floor(wholeValues % 1000 ** (numCommas - i) / (1000 ** (numCommas - i - 1)))
  );

  const paddedCommaValues = commaValues.map((val, i) => i === 0 ? `${val}` : `${val}`.padStart(3, "0"))
  
  return `${paddedCommaValues.join(",")}`;
}

const numberToMonetaryString = (dollars: number): string => {
  if (dollars < 0.001) return `$0`;

  const decimalValues = Math.floor(dollars * 100 % 100);
  const paddedDecimals = `${decimalValues}`.padStart(2, "0")
  
  const commaSepWholeValues = numberToCommaSeparated(dollars);
  
  return `$${commaSepWholeValues}.${paddedDecimals}`
}

const toSignificantDecimals = (num: number, decimals_?: number): string => {
  const decimals = (decimals_ == undefined || decimals_ < 0) ? 1 : decimals_;

  const wholeValue = Math.floor(num);
  
  if (decimals === 0) {
    return `${numberToCommaSeparated(wholeValue)}`
  }
  
  const decimalValue = num - wholeValue

  const decimalsToFirstSig = decimalValue !== 0 ? Math.floor(Math.log(decimalValue) / Math.log(10)) * -1 : 0
  
  const totalSigDecimals = decimalsToFirstSig + decimals - 1;
  
  const wholeDecimalValue = Math.floor(decimalValue * 10 ** totalSigDecimals % 10 ** totalSigDecimals)
  
  return `${numberToCommaSeparated(wholeValue)}.${`${wholeDecimalValue}`.padStart(decimalsToFirstSig, "0")}`
}


export { numberToCommaSeparated, numberToMonetaryString, toSignificantDecimals };

