// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

const addressSize = 12 / 2;

export const trimAddress = (address: string): string => {
  const leftSide = address.substring(0, addressSize);

  const rightSide = address.substring(
    address.length - addressSize,
    address.length
  );

  return `${leftSide}..${rightSide}`;
};

export const trimAddressShort = (address: string) => {
  const leftSide = address.substring(0, 5);

  return `${leftSide}...`;
};
