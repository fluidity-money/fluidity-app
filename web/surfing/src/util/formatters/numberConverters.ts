// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

export const numberToMonetaryString = (dollars: number): string => {
  const decimalValues = Math.floor(dollars * 100 % 100);
  const wholeValues = Math.floor(dollars);

  const numCommas = Math.max(Math.floor(Math.log(wholeValues) / Math.log(1000)) + 1, 1);
  const commaValues = Array.from(
    {length: numCommas},
    (_, i) => Math.floor(wholeValues % 1000 ** (numCommas - i) / (1000 ** (numCommas - i - 1)))
  );

  const paddedDecimals = `${decimalValues}`.padStart(2, "0")
  const paddedCommaValues = commaValues.map((val, i) => i === 0 ? `${val}` : `${val}`.padStart(3, "0"))
  
  return `$${paddedCommaValues.join(",")}.${paddedDecimals}`
}

