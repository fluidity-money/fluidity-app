// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.


const addressSize = 12 / 2;

export const trimAddress = (address: string): string => {
  const leftSide = address.substr(0, addressSize);

  const rightSide = address.substr(
    address.length - addressSize,
    addressSize
  );

  return leftSide + ".." + rightSide;
};
