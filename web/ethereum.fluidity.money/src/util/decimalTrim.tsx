
export const decimalTrim = (amount: string, limit: number) => {
  if (limit <= 0) {
    return amount;
  }

  const trim = amount.indexOf('.') != -1
    ? amount.slice(0, amount.indexOf('.') + limit)
    : amount;

  // Remove the point at the end of string decimal if limit is 1
  if(limit == 1) {
    return trim.slice(0, (trim.length - 1))
  }
  
  return trim;
};
