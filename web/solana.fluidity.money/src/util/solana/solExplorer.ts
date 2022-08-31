// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

export const solExplorer = (hash: string, type: "address" | "tx") => {
  if (process.env.REACT_APP_SOL_NETWORK === "devnet")
    return `https://explorer.solana.com/${type}/${hash}?cluster=devnet`;
  if (process.env.REACT_APP_SOL_NETWORK === "mainnet")
    return `https://explorer.solana.com/${type}/${hash}`;
};
