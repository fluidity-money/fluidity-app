import {parseUnits} from "ethers/utils";

// Format a raw token amount and insert a decimal place at the correct offset
export const formatAmount = (amount: string, decimals?: number): string => {
    return formatCurrency(tokenAmountToDecimal(amount), decimals)
};

// format a decimal number string into a comma-separated form
export const formatCurrency = (amount: string, decimals?: number): string => {
  // split, since we only modify before the decimal place
  let [pre, post] = amount.split('.');

  // if amount is <1, show all decimals (return as is), otherwise show only <decimals> places
  if ((pre === "0") || (!decimals && pre.length <= 3))
      return amount;

  // cut the back three digits repeatedly
  let newPre = "";
  while (pre.length > 3) {
    newPre = "," + pre.slice(pre.length - 3) + newPre;
    pre = pre.slice(0, pre.length - 3);
  }

  // prepend the remaining digits, if not a multiple of 3
  newPre = pre + newPre;

  // trim to the desired number of decimals
  if (decimals && post)
    post = post.slice(0, decimals);
  // if there are decimals, put them back
  return post ?
    newPre + '.' + post :
    newPre;
};

const decimals = 6;
// convert a raw token amount to a decimal string
export const tokenAmountToDecimal = (value: string): string => {

  // < 1, so append after decimal
  if (value.length <= decimals)
    value = `0.${new Array(decimals - value.length + 1).join("0")}${value}`
  // >= 1, so split around the decimal place
  else
    value = value.slice(0, value.length - decimals) +
      "." +
      value.slice(value.length - decimals);
 
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

// checks if a VALID input string is non-zero
export const isNonZero = (amount?: string): boolean => {
  if (!amount)
    return false;

  const parsedAmount = parseUnits(amount, decimals);
  return !parsedAmount.isZero();
}
