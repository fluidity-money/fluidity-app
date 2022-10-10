// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

// Loops through all amounts, sums them up, and then converts into US currency format
const currencyParser = (data: number[]) => {
  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.reduce((sum, add) => sum + add, 0))}`;
};

export default currencyParser;
