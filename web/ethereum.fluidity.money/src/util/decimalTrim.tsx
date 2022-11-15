// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.


export const decimalTrim = (amount: string, limit: number) => {
  if (limit <= 0) {
    return amount;
  }

  const trimIndex = amount.indexOf('.');
  const trim = trimIndex > -1 ? amount.slice(0, trimIndex + limit + 1) : amount;
  return trim;
};
