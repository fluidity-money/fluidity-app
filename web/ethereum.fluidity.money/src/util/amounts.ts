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
