import { chainIdFromEnv } from "./chainId";

const rootRopstenAddress = "https://ropsten.etherscan.io";
const rootKovanAddress = "https://kovan.etherscan.io";
const rootAddress = "https://etherscan.io";

export const etherscanAddressRopsten = (address: string) =>
  `${rootRopstenAddress}/address/${address}`;

export const etherscanTransactionRopsten = (transaction: string) =>
  `${rootRopstenAddress}/tx/${transaction}`;

export const etherscanAddressKovan = (address: string) =>
  `${rootKovanAddress}/address/${address}`;

export const etherscanTransactionKovan = (transaction: string) =>
  `${rootKovanAddress}/tx/${transaction}`;

export const etherscanAddressMainnet = (address: string) =>
  `${rootAddress}/address/${address}`;

export const etherscanTransactionMainnet = (transaction: string) =>
  `${rootAddress}/tx/${transaction}`;

export const etherscanAddress = (address: string) => {
  let link = "";
  chainIdFromEnv() === 1
    ? (link = etherscanAddressMainnet(address))
    : chainIdFromEnv() === 3
    ? (link = etherscanAddressRopsten(address))
    : chainIdFromEnv() === 42
    ? (link = etherscanAddressKovan(address))
    : (link = rootAddress);
  return link;
};

export const etherscanTransaction = (address: string) => {
  let link = "";
  chainIdFromEnv() === 1
    ? (link = etherscanTransactionMainnet(address))
    : chainIdFromEnv() === 3
    ? (link = etherscanTransactionRopsten(address))
    : chainIdFromEnv() === 42
    ? (link = etherscanTransactionKovan(address))
    : (link = rootAddress);
  return link;
};
