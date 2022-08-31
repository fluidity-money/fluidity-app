import * as hre from 'hardhat';
import { ethers } from 'ethers';
import { mustEnv } from '../script-utils';

const EnvFluidTokenAddress = `FLU_ETHEREUM_CHANGE_ORACLE_FLUID_TOKEN_ADDRESS`;
const EnvOraclePrikey = `FLU_ETHEREUM_CHANGE_ORACLE_ORACLE_PRIKEY`;
const EnvNewOracleAddress = `FLU_ETHEREUM_CHANGE_ORACLE_NEW_ADDRESS`;

async function main() {
  const fluidToken = mustEnv(EnvFluidTokenAddress);
  const walletKey = mustEnv(EnvOraclePrikey);
  const newOracleAddress = mustEnv(EnvNewOracleAddress);

  const wallet = new hre.ethers.Wallet(walletKey);

  const token = new ethers.Contract(
    fluidToken,
    [
      "function oracle() returns (address)",
      "function updateOracle(address)",
    ],
    wallet,
  )

  console.log('before');
  console.log(await token.callStatic.oracle());

  const tx = await token.updateOracle(newOracleAddress);
  console.log(await tx.wait());

  console.log('after');
  console.log(await token.callStatic.oracle());
}

main()
  .then(console.log)
  .catch(console.error);
