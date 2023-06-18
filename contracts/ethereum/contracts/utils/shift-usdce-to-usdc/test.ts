
// Swap USDE for USDC. Assumes that there is a liquid pool available for the pair.

import * as hre from "hardhat";

import { ethers } from "ethers";

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

const UsdcEAddr = "";

const UsdcAddr = "0xaf88d065e77c8cc2239327c5edb3a432268e5831";

const AaveV3AddressProviderAddr = "0xa97684ead0e402dc232d5a977953df7ecbab3cdb";

// AaveV3ATokenAddr is the usdc native token deployment atoken (not currently possible!)
const AaveV3ATokenAddr = "0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC";

describe("ShiftUsdcEToUsdc", async () => {
  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK !== "arbitrum") this.skip();
  });

  it("should shift over everything correctly", async () => {
    // pretend to be the multisig

    const tokenBytecode = (await hre.artifacts.readArtifact("Token")).deployedBytecode;

    await hre.network.provider.request({
      method: "hardhat_setCode",
      params: [TokenAddr, tokenBytecode]
    });

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [MultisigAddr],
    });

    await hre.network.provider.request({
      method: "hardhat_setBalance",
      params: [
        MultisigAddr,
        ethers.constants.MaxUint256.toHexString()
      ]
    });

    const signer = await hre.ethers.getSigner(MultisigAddr);

    const token =
      (await hre.ethers.getContractAt("Token", TokenAddr))
        .connect(signer);

    const shifterFactory = await hre.ethers.getContractFactory("ShiftUsdcEToUsdc");

    const shifter = await shifterFactory.connect(signer).deploy();

    // set the owner of token to the shifter for the duration of this

    await token.updateOperator(shifter.address);

    const deadline = await getLatestTimestamp(hre) + 1000;

    await shifter.main({
      multisig: MultisigAddr,
      aaveV3LiquidityProviderBeacon: AaveV3LiquidityProviderBeaconAddr,
      registry: RegistryAddr,
      token: TokenAddr,
      deadline: deadline,
      router: RouterAddr,
      usdce: UsdcEAddr,
      usdc: UsdcAddr,
      aaveV3AddressProvider: AaveV3AddressProviderAddr,
      aaveV3AToken: AaveV3ATokenAddr
    });

    await token.updateOperator(MultisigAddr);
  });
});