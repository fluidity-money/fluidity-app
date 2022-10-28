// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

// Address is an address string with trimmed 0x
type Address = string;

// addressSize is the formatted Address length
const addressSize = 12 / 2;

// normaliseAddress creates a new validated Address type
const normaliseAddress = (address: string): Address => {
  if (address.length < 3) throw Error("Address length too short!");
  
  const validatedAddress = address as Address;

  return trimLeading0x(validatedAddress);
}

// trimAddress formats Address to abcdef..uvwxyz
const trimAddress = (address: Address): Address => {
  const leftSide = address.substring(0, addressSize);

  const rightSide = address.substring(
    address.length - addressSize,
    address.length
  );

  return `${leftSide}..${rightSide}`;
};

// trimAddress formats Address to abcdef...
const trimAddressShort = (address: Address): Address => {
  const leftSide = address.substring(0, 5);

  return `${leftSide}...`;
};

const hasLeading0x = (address: string) =>
  address[0] === '0' &&
  address[1] === 'x'

// trimAddress formats Address to 0xabcdef
const appendLeading0x = (address: Address): string =>
  `0x${address}`

// trimAddress formats Address to abcdef
const trimLeading0x = (address: Address): Address =>
  hasLeading0x(address) ? address.substring(2) : address

export {
  normaliseAddress,
  trimAddress,
  trimAddressShort,
  appendLeading0x,
  trimLeading0x,
};
