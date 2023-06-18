
import * as hre from "hardhat";

import { getLatestTimestamp } from "../../../script-utils";

// intended to be used on arbitrum

// https://docs.fluidity.money/docs/fundamentals/governance-structure#community-1
const MultisigAddr = "0x429Dc27be907e16EF40329503F501361879510e0";

// AaveV3LiquidityProvider.sol's beacon
const AaveV3LiquidityProviderBeaconAddr = "0x90AEfF2D9376476F770463c77aF979dfd115Bbf0";

// Registry.sol
const RegistryAddr = "0x28EE3aCA2DAA47a7585C5c579dBb0998C08f845d";

// Token.sol for fUSDC
const TokenAddr = "0x4CFA50B7Ce747e2D61724fcAc57f24B748FF2b2A";

// RouterAddr for Uniswap V3 SwapRouter
const RouterAddr = "0xe592427a0aece92de3edee1f18e0157c05861564";

const UsdcEAddr = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8";

const UsdcAddr = "0xaf88d065e77c8cc2239327c5edb3a432268e5831";

const AaveV3AddressProviderAddr = "";

// AaveV3ATokenAddr is the usdc native token deployment atoken (not currently possible!)
const AaveV3ATokenAddr = "";

const main = async () => {
  const shifterFactory = await hre.ethers.getContractFactory("ShiftUsdcEToUsdc");

  const shifter = await shifterFactory.deploy();

  const deadline = await getLatestTimestamp(hre) + 1000;

  // pretend to be the multisig

  await shifter.main({
    multisig: MultisigAddr,
    aaveV3LiquidityProviderBeacon: AaveV3LiquidityProviderBeaconAddr,
    registry: RegistryAddr,
    token: TokenAddr,
    Deadline: deadline,
    router: RouterAddr,
    usdce: UsdcEAddr,
    usdc: UsdcAddr,
    aaveV3AddressProvider: AaveV3AddressProviderAddr,
    aaveV3AToken: AaveV3ATokenAddr
  });
};

main().then(_ => {});
