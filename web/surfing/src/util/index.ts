// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

export { useViewport, useClickOutside } from "./hooks";

export {
  toSignificantDecimals,
  numberToMonetaryString,
  stringifiedNumberToMonetaryString,
  numberToCommaSeparated,
  formatTo12HrDate,
  formatToGraphQLDate,
  normaliseAddress,
  trimAddress,
  trimAddressShort,
  appendLeading0x,
  trimLeading0x,
  decimalTrim,
  shorthandAmountFormatter,
} from "./formatters";

export { getProviderImgPath } from "./liquidityProviders/providers";
