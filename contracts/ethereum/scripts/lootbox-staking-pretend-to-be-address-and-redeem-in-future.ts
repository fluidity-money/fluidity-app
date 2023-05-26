
import * as hre from "hardhat";

import { ethers } from "ethers";

import type { BigNumber } from "ethers";

import { USUAL_LOOTBOX_STAKING } from "../arbitrum-constants";

import { mustEnv } from "../script-utils";

import { redeem } from "../lootbox-utils";

const EnvImpersonatedAccount = "FLU_LOOTBOX_STAKING_PRETEND_ADDR";

type stakingDeposit = {
  redeemTimestamp: BigNumber;
  camelotTokenA: BigNumber;
  camelotTokenB: BigNumber;
  sushiswapTokenA: BigNumber;
  sushiswapTokenB: BigNumber;
  fusdcUsdcPair: boolean;
}

const main = async () => {
  const impersonatedAddr = mustEnv(EnvImpersonatedAccount);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [impersonatedAddr]
  });

  const signer = await hre.ethers.getSigner(impersonatedAddr);

  const lootboxStakingBytecode =
    (await hre.artifacts.readArtifact("LootboxStaking")).deployedBytecode;

  await hre.network.provider.request({
    method: "hardhat_setCode",
    params: [
      USUAL_LOOTBOX_STAKING,
      lootboxStakingBytecode
    ]
  });

  const staking =
    (await hre.ethers.getContractAt("LootboxStaking", USUAL_LOOTBOX_STAKING))
      .connect(signer);

  const deposits = await staking.deposits(impersonatedAddr);

  const zero = ethers.constants.Zero;

  type acc = [ BigNumber, BigNumber, BigNumber, BigNumber ];

  const [ greatestTimestamp, fusdc, usdc, weth ] =
    deposits.reduce((acc: acc, resp: stakingDeposit) => {
      const {
        redeemTimestamp,
        camelotTokenA,
        camelotTokenB,
        sushiswapTokenA,
        sushiswapTokenB,
        fusdcUsdcPair
      } = resp;

      const [ ts, fusdc, usdc, weth ] = acc;

      const tokenB = camelotTokenB.add(sushiswapTokenB);

      return [
        redeemTimestamp.gt(ts) ? redeemTimestamp : ts,
        fusdc.add(camelotTokenA.add(sushiswapTokenA)),
        fusdcUsdcPair ? usdc.add(tokenB) : usdc,
        fusdcUsdcPair ? weth : weth.add(tokenB)
      ];

    }, [zero, zero, zero, zero]);

  console.log(
    `amount deposited by ${impersonatedAddr}, fusdc: ${fusdc}, usdc: ${usdc}, weth: ${weth}`
  );

  const futureTimestamp = greatestTimestamp.add(10);

  console.log(`setting the time of the next block to ${futureTimestamp}`);

  await hre.network.provider.request({
    method: "evm_setNextBlockTimestamp",
    params: [futureTimestamp.toHexString()]
  });

  console.log(`about to redeem ${impersonatedAddr}`);

  await signer.sendTransaction({
    from: impersonatedAddr,
    to: impersonatedAddr
  });

  const [ fusdcRedeemed, usdcRedeemed, wethRedeemed ] = await redeem(staking);

  console.log(
    `redeemed for addr ${impersonatedAddr}, fusdc redeemed ${fusdcRedeemed}, usdc redeemed ${usdcRedeemed}, weth redeemed ${wethRedeemed}`
  );
};

main().then(_ => {});
