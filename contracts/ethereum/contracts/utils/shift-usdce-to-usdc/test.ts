
// Swap USDE for USDC. Assumes that there is a liquid pool available for the pair.

import * as hre from "hardhat";

import { ethers } from "ethers";

import { BigNumber } from "ethers";

import { getLatestTimestamp } from "../../../script-utils";

// intended to be used on arbitrum

// https://docs.fluidity.money/docs/fundamentals/governance-structure#community-1
const MultisigAddr = "0x429Dc27be907e16EF40329503F501361879510e0";

// AaveV3LiquidityProvider.sol's beacon
const AaveV3LiquidityProviderBeaconAddr = "0xE873355E52792fb2Dd87bD5b265B61A10E4dA567";

// Registry.sol
const RegistryAddr = "0x28EE3aCA2DAA47a7585C5c579dBb0998C08f845d";

// Token.sol for fUSDC
const TokenAddr = "0x4CFA50B7Ce747e2D61724fcAc57f24B748FF2b2A";

const UsdcEAddr = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8";

const UsdcNAddr = "0xaf88d065e77c8cc2239327c5edb3a432268e5831";

describe("ShiftUsdcEToUsdcN", async () => {
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

    const signerAddr = await signer.getAddress();

    const token =
      (await hre.ethers.getContractAt("Token", TokenAddr))
        .connect(signer);

    const shifterFactory = await hre.ethers.getContractFactory("ShiftUsdcEToUsdcN");

    const shifter = await shifterFactory.connect(signer).deploy(signerAddr);

    // set the owner of token to the shifter for the duration of this

    await token.updateOperator(shifter.address);

    const deadline = await getLatestTimestamp(hre) + 1000;

    await shifter.main({
      multisig: MultisigAddr,
      aaveV3LiquidityProviderBeacon: AaveV3LiquidityProviderBeaconAddr,
      registry: RegistryAddr,
      token: TokenAddr,
      deadline: deadline
    });

    await token.updateOperator(MultisigAddr);
  });
});