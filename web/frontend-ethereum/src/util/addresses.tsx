
const addressSize = 12 / 2;

export const trimAddress = (address: string): string => {
  const leftSide = address.substr(0, addressSize);

  const rightSide = address.substr(
    address.length - addressSize,
    addressSize
  );

  return leftSide + ".." + rightSide;
};
