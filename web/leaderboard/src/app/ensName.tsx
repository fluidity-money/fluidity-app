import React from "react";
import { useEnsName, Address } from "wagmi";

import { trimAddress } from "@fluidity-money/surfing";

const defaultChain = 1; // taken from wagmi documentation

const UseEnsName = ({ address }: { address: string }) => {
  const userAddress = address as Address;

  const ensName = useEnsName({
    address: userAddress,
    chainId: defaultChain,
  });

  return (
    <div>{ensName.data === null ? trimAddress(address) : ensName.data}</div>
  );
};

export default UseEnsName;
