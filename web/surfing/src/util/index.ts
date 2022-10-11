// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

// export { default as Web3Provider, useWallet } from "./hooks/useWeb3State";
// export { fluRelayEnvironment, useWinningTransactions } from './api';
export type { SupportedChainsList } from "./chainProviders";

export { SupportedChains } from "./chainProviders";
export {
  numberToMonetaryString,
  numberToCommaSeparated,
  trimAddress,
  trimAddressShort,
  formatTo12HrDate,
  formatToGraphQLDate,
} from "./formatters";
