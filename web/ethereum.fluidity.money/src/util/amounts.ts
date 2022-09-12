// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import { parseUnits } from "ethers/utils";

// Format a raw token amount and insert a decimal place at the correct offset
export const formatAmount = (
  amount: string,
  tokenDecimals: number,
  roundingDecimals?: number
): string => {
  return formatCurrency(
    tokenAmountToDecimal(amount, tokenDecimals),
    roundingDecimals
  );
};

// format a decimal number string into a comma-separated form
export const formatCurrency = (amount: string, decimals?: number): string => {
  // split, since we only modify before the decimal place
  let [pre, post] = amount.split(".");

  // cut the back three digits repeatedly
  let newPre = "";
  while (pre.length > 3) {
    newPre = "," + pre.slice(pre.length - 3) + newPre;
    pre = pre.slice(0, pre.length - 3);
  }

  // prepend the remaining digits, if not a multiple of 3
  newPre = pre + newPre;

  // trim to the desired number of decimals
  if (decimals && post) {
    post = post.slice(0, decimals);
    if (post.length < decimals)
      post += '0'.repeat(decimals - post.length)
  }
  // if there are decimals, put them back
  return post ? newPre + "." + post : newPre;
};

// convert a raw token amount to a decimal string
export const tokenAmountToDecimal = (
  value: string,
  tokenDecimals: number
): string => {
  // < 1, so append after decimal
  if (value.length <= tokenDecimals)
    value = `0.${new Array(tokenDecimals - value.length + 1).join(
      "0"
    )}${value}`;
  // >= 1, so split around the decimal place
  else
    value =
      value.slice(0, value.length - tokenDecimals) +
      "." +
      value.slice(value.length - tokenDecimals);

  // remove trailing zeros by finding a position to trim to
  let lastChar = value.length - 1;
  let decimalPos = value.indexOf(".");
  if (decimalPos === -1) decimalPos = 0;
  if (value !== "0" && value !== "0.0") {
    // clear only trailing 0s or .s from the decimal part of the number
    while (
      lastChar > decimalPos - 1 &&
      (value[lastChar] === "0" || value[lastChar] === ".")
    ) {
      lastChar--;
    }
  }

  // perform the slice to remove unnecessary digits
  value = value.slice(0, lastChar + 1);

  // check for ending in .0
  if (value.endsWith(".0")) value = value.slice(0, value.length - 2);

  return value;
};

// checks if a VALID input string is non-zero
export const isNonZero = (amount: string, decimals: number): boolean => {
  if (!amount || decimals === 0) return false;

  const parsedAmount = parseUnits(amount, decimals);
  return !parsedAmount.isZero();
};

/** cut off decimals past `decimals` places
 * @param input string of the form xx.yy
 * @param decimals the number of decimals to trim to
 */
export const trimAmount = (input: string, decimals: number): string => {
  let [pre, post] = input.split(".");

  if (post && post.length > decimals)
    return pre + "." + post.substr(0, decimals);
  else return input;
};

/** convert long balance strings to xx...xxx
 * @param balance string
 */
export const shortBalance = (balance: string) =>
  balance.length < 12
    ? balance
    : `${balance}`.substr(0, 4) +
      "..." +
      `${balance}`.substr(`${balance}`.length - 2, `${balance}`.length - 1);

/** creates a shorthand for large amounts e.g 10,000 equates to 10k
 * @param value string of the form xx.yy
 * @param decimals the number of decimals to trim to
 */
export const shorthandAmountFormatter = (value: string, decimals: number): string => {

  let num: number = parseFloat(value)
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