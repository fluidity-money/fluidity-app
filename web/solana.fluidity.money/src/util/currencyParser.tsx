// Loops through all amounts, sums them up, and then converts into US currency format
const currencyParser = (data: number[]) => {
  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.reduce((sum, add) => sum + add, 0))}`;
};

export default currencyParser;
