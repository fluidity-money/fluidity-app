// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import hre from 'hardhat';
const ethers = hre.ethers;
import "@nomiclabs/hardhat-waffle";
import {USUAL_FUSDT_ADDR} from '../test-constants';
import { optionalEnv } from '../script-utils';

const EnvContractAddress = `FLU_ETHEREUM_SPAM_TRANSFERS_CONTRACT_ADDRESS`;

//make a transfer of 10 fUSDT from accounts[0] -> accounts[1]
async function main() {
  const targetAddress = optionalEnv(EnvContractAddress, USUAL_FUSDT_ADDR);

  const [from, to] = (await ethers.getSigners())

  const token = await hre.ethers.getContractAt(
    targetAddress,
    "IERC20",
    from,
  );

  const amount = ethers.utils.parseUnits("10",6);

  const res = await token.transfer(to.address, amount);
  await res.wait();

  console.log("made transfer",res);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
