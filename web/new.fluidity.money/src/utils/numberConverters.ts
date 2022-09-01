// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

export const numberToMonetaryString = (value: number): string => {
    const decimalValues = value % 100;
    const wholeValues = Math.floor(value / 100);

    const numCommas = Math.floor(Math.log(wholeValues) / Math.log(1000)) + 1;
    const commaValues = Array.from(
      {length: numCommas},
      (_, i) => Math.floor(wholeValues % 1000 ** (numCommas - i) / (1000 ** (numCommas - i - 1)))
    );
    
    return `$${commaValues.join(",")}.${decimalValues}`
  }

