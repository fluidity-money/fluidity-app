
export const decimalTrim = (amount: string, limit: number) => {
  if (limit <= 0) {
    return amount;
  }

  const trimIndex = amount.indexOf('.');
  const trim = trimIndex > -1 ? amount.slice(0, trimIndex + limit + 1) : amount;
  return trim;
};
