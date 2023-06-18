
/**
 * These tests are only available on mainnet Ethereum!
 *
 * These tests test that the contract for max approvals
 * (PermitRouterV1) is facilitating permit using an underlying
 * correctly, and doing off-chain signing for wrapping work.
 */

import * as hre from "hardhat";

import { expect } from "chai";

import { BigNumber, ethers } from "ethers";

import { contracts, bindings } from "./setup-mainnet";

import { getLatestTimestamp } from "../script-utils";

const MaxUint256 = ethers.constants.MaxUint256;

const signAndErc20InPermit = async (
  contract: ethers.Contract,
  rootSignerAddress: string,
  ownerAddr: string,
  fAssetAddr: string,
  erc20AmountIn: BigNumber,
  nonce: number,
  deadline: number
): Promise<BigNumber> => {
  const rawSig = await hre.network.provider.send(
    "eth_signTypedData_v4",
    [rootSignerAddress, JSON.stringify({
      domain: {
        name: "PermitRouterV1",
        version: "1",
        chainId: 31337,
        verifyingContract: contract.address
      },

      primaryType: "ERC20InPermit",

      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        ERC20InPermit: [
          { name: "fAsset", type: "address" },
          { name: "erc20AmountIn", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ]
      },

      message: {
        fAsset: fAssetAddr,
        erc20AmountIn: erc20AmountIn.toHexString(),
        nonce: nonce,
        deadline: deadline
      }
    })]
  );

  const { r, s, v } = hre.ethers.utils.splitSignature(rawSig);

  const amountOut = await contract.callStatic.erc20InPermit(
    ownerAddr, // owner/recipient
    fAssetAddr,
    erc20AmountIn,
    deadline,
    v,
    r,
    s
  );

  await contract.erc20InPermit(
    ownerAddr, // owner/recipient
    fAssetAddr,
    erc20AmountIn,
    deadline,
    v,
    r,
    s
  );

  return amountOut;
};

describe("PermitRouter", async () => {
  let usdt: ethers.Contract;
  let fusdt: ethers.Contract;

  let permitRouterV1: ethers.Contract;

  let usdtSigner: ethers.Signer;
  let usdtSignerAddress: string;

  before(async function() {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet")
      return this.skip();

    ({
      usdt: { baseAccount1: usdt, fluidAccount1: fusdt }
    } = bindings);

    usdtSigner = usdt.signer;
    usdtSignerAddress = await usdtSigner.getAddress();

    ({ permitRouterV1 } = contracts);

    await usdt.approve(permitRouterV1.address, MaxUint256);
  });

  it(
    "should, for the test private key, sign a erc20 in permit without the underlying",
    async () => {
      const usdtBalance = await usdt.balanceOf(usdtSignerAddress);

      expect(usdtBalance).to.be.gt(0);

      const amount = BigNumber.from(ethers.utils.randomBytes(32)).mod(
        usdtBalance.sub(10)
      )
        .add(10);

      const deadline = (await getLatestTimestamp(hre)) + 100000;

      const amountOut = await signAndErc20InPermit(
        permitRouterV1.connect(usdtSigner),
        usdtSignerAddress,
        usdtSignerAddress,
        fusdt.address,
        amount,
        0,
        deadline
      );

      expect(amountOut).to.be.equal(amount);
    }
  );
});
