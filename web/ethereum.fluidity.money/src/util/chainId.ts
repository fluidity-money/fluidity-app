enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Kovan   = 42,
  Hardhat = 31337,
}

/**
 * @param id_ - Hex or numeric representation, as a number or string
 * @returns chainId as an enum
 * @example <caption>Using Kovan</caption>
 * "0x2a"        => ChainId.Kovan
 * "42"          => ChainId.Kovan
 * 0x2a          => ChainId.Kovan
 * 42            => ChainId.Kovan
 * ""            => null
 **/
export const toChainId = (id_?: string | number): ChainId | null => {
  const indexed: any = ChainId[Number(id_) as any];
  return ChainId[indexed] as any as ChainId ?? null
}

/**
 * @returns ChainId from the environment variable REACT_APP_CHAIN_ID,
 * or throws if it is unset or invalid
 */
export const chainIdFromEnv = (): ChainId => {
  const envChainId = process.env.REACT_APP_CHAIN_ID;
  const chainId = toChainId(envChainId);

  if (!chainId) {
    throw new Error(`REACT_APP_CHAIN_ID not set or incorrect!: ${chainId}`);
  }

  return chainId;
}

export default ChainId;
