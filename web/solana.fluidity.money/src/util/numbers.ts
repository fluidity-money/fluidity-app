// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import BN from "bn.js";
import {MAX_U64, Token, TokenAmount} from "@saberhq/token-utils";
import {Dispatch, SetStateAction} from "react";

export const MAX_TOKEN_VALUE = (token: Token): TokenAmount =>
    new TokenAmount(token, MAX_U64);

export const bnToTokenAmount = (token: Token, bn: BN): TokenAmount =>
    new TokenAmount(token, bn.toString());
 
export const bnToDisplayString = (token: Token, bn: BN): string =>
    bnToTokenAmount(token, bn).toExact();

export const rawToDisplayString = (token: Token, value: string): string => {
    try {
        return bnToDisplayString(token, new BN(value));
    } catch (e) {
        return value;
    }
}

/**
 * @param amount raw amount string
 * @param decimals number of decimals
 * @returns display string with decimal place
 */
export const amountToDecimalString = (amount: string, decimals: number) => {
  const a = amount.slice(0, -decimals);
  const b = amount.slice(-decimals);
  let result = "";
  if (amount.length > decimals)
    result = a + '.' + b 
  else
    result = "0." + "0".repeat(decimals - amount.length).toString() + amount

  return clearTrailingZeros(result);
}

/**
 * @param value decimal amount string
 * @returns value without any trailing (i.e. unnecessary) zeros
 */
export const clearTrailingZeros = (value: string) => {
  // remove trailing zeros by finding a position to trim to
  let lastChar = value.length - 1;
  let decimalPos = value.indexOf(".");
  if (decimalPos === -1)
    decimalPos = 0;
  if (value !== "0" && value !== "0.0") {
    // clear only trailing 0s or .s from the decimal part of the number
    while (lastChar > decimalPos - 1 && (value[lastChar] === "0" || value[lastChar] === ".")) {
      lastChar--;
    }
  }

  // perform the slice to remove unnecessary digits
  value = value.slice(0, lastChar + 1);

  // check for ending in .0
  if (value.endsWith(".0"))
    value = value.slice(0, value.length - 2);

  return value;
}

//parse a number containing decimals, e.g. 12.04
export const decimalToTokenAmount = (token: Token, value: string): TokenAmount | Error => {
    //split into decimal and integer components
    const split = value.split('.');
    let [pre, post] = split;
    const {decimals} = token;

    //no decimals
    if (split.length === 1)
        return new TokenAmount(token, value + "0".repeat(decimals));

    //if too many decimals, trim them off
    if (post.length > decimals)
        post = post.slice(0,decimals);

    //there are decimals, try and parse
    try {
        //before decimal - n * 10 ** decimals
        const first = new BN(pre)
            .mul(new BN(10 ** decimals));
        //after decimal - n * 10 ** (decimals - post digits)
        const second = new BN(post)
            .mul(new BN(10 ** (decimals - post.length)));
        //add and return
        return bnToTokenAmount(token, first.add(second));
    } catch (e: any) {
        return e as Error;
    }
}

//whether a value ends with a trailing decimal place, or trailing zeros after a decimal place
export const trailingDecimalZeros = (value: string): boolean =>
  value.endsWith('.') || (value.endsWith('0'))

type StringDispatch = Dispatch<SetStateAction<string>>;
//wrap react setters for a token amount, handling invalid inputs and separating the displayed and actual values
export const tokenValueInputHandler = (value: string, setTo: StringDispatch, setToRaw: StringDispatch, token: Token | null) => {

  if (!token)
    return;

  //clearing the entire input
  if (!value) {
    setTo(value);
    setToRaw("0");
    return;
  }
  
  const hasDecimal = value.indexOf('.') !== -1;

  //trying to overinput decimals
  if (hasDecimal && value.substr(value.indexOf('.') + 1).length > token.decimals)
    return;
  
  //if trailing decimal input, show but don't parse it (e.g. trailing '.')
  if (hasDecimal && trailingDecimalZeros(value)) {
    setTo(value);
    return;
  }

  try {
    //parse and update state
    const tokenValue = decimalToTokenAmount(token, value);
    if (tokenValue instanceof Error)
      throw tokenValue;

    setToRaw(tokenValue.toU64().toString());
    setTo(tokenValue.toExact());

  //ignore errors, as they represent invalid inputs
  } catch (e) {}
}

// Creates a shorthand for large amounts e.g 10,000 equates to 10k
export const shorthandAmountFormatter = (value: string, decimals: number): string => {

  let num: number = parseFloat(value);
  if(num < 1) {
    return value;
  }
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(decimals).replace(rx, "$1") + item.symbol : "0";
};