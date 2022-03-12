
const rootAddress = "https://ropsten.etherscan.io";

export const etherscanAddress = (address: string) =>
  `${rootAddress}/address/${address}`;

export const etherscanTransaction = (transaction: string) =>
  `${rootAddress}/tx/${transaction}`;
