
export const decimalTrim = (amount: string, limit: number) => {
  const trim = amount.indexOf('.') != -1
    ? amount.slice(0, amount.indexOf('.') + limit)
    : amount;

  return trim;
};
