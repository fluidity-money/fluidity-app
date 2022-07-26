
const addressSize = 12 / 2;

export const trimAddress = (address: string): string => {
  const leftSide = address.substr(0, addressSize);

  const rightSide = address.substr(
    address.length - addressSize,
    addressSize
  );

  return leftSide + ".." + rightSide;
};

/**
 *@returns the canonical address encoding used by the API 
 *with no 0x prefix, and in lowercase
 */
export const prefixlessAddress = (address: string): string => {
  if (address.startsWith("0x"))
    address = address.substring(2);
  return address.toLowerCase();
}
