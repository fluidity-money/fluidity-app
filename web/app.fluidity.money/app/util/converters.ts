const B64ToUint8Array = (b64string: string): Uint8Array =>
  Buffer.from(b64string, "base64");

export { B64ToUint8Array };

/**
 * Creates a shorthand for large amounts e.g 10,000 equates to 10k
 * @param  uiAmount already converted number from its raw string Bignumber form
 * @param decimalPlaces number of decimals
 * @returns display string with decimal place
 */
export const shorthandAmountFormatter = (
  uiAmount: string,
  decimalPlaces: number
): string => {
  const num: number = parseFloat(uiAmount);
  if (num < 1) {
    return uiAmount;
  }
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(decimalPlaces).replace(rx, "$1") + item.symbol
    : "0";
};

/**
 * @param amount raw amount string
 * @param decimals number of decimals
 * @returns display string with decimal place
 */
export const amountToDecimalString = (amount: string, decimals: number) => {
  const a = amount.slice(0, -decimals);
  const b = amount.slice(-decimals);
  let result = "";
  if (amount.length > decimals) result = a + "." + b;
  else result = "0." + "0".repeat(decimals - amount.length).toString() + amount;

  return clearTrailingZeros(result);
};

/**
 * @param value decimal amount string
 * @returns value without any trailing (i.e. unnecessary) zeros
 */
export const clearTrailingZeros = (value: string) => {
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
