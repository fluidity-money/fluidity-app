// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import ChainId, { chainIdFromEnv } from "./chainId";

const rootRopstenAddress = "https://ropsten.etherscan.io";
const rootKovanAddress = "https://kovan.etherscan.io";
const rootAddress = "https://etherscan.io";
const rootAuroraAddress = "https://aurorascan.dev/";

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

export const etherscanAddressAurora = (address: string) =>
  `${rootAuroraAddress}/address/${address}`;

export const etherscanTransactionAurora = (transaction: string) =>
  `${rootAuroraAddress}/tx/${transaction}`;

export const etherscanAddress = (address: string) => {
  let link = "";
  chainIdFromEnv() === ChainId.Mainnet
    ? (link = etherscanAddressMainnet(address))
    : chainIdFromEnv() === ChainId.Ropsten
    ? (link = etherscanAddressRopsten(address))
    : chainIdFromEnv() === ChainId.Kovan
    ? (link = etherscanAddressKovan(address))
    : chainIdFromEnv() === ChainId.AuroraMainnet
    ? (link = etherscanAddressAurora(address))
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
