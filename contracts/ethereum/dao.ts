
import { ethers } from 'ethers';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';

const ELEVEN_DAYS_PLUS_1 = 950400 + 1;

export const executeCalldataOnDAOVoteAllAndAdvanceTime = async(
  hre: HardhatRuntimeEnvironment,
  dao: ethers.Contract,
  veGov: ethers.Contract,
  signer: ethers.Signer,
  contractTarget: string,
  calldata: string
) => {
  const balance = await veGov.balanceOf(await signer.getAddress());

  const proposalId = dao.connect(signer).createProposal(
    "",
    contractTarget,
    balance,
    0,
    false,
    calldata
  );

  await hre.network.provider.send(
    "evm_increaseTime",
    [ ELEVEN_DAYS_PLUS_1 ]
  );

  await dao.executeProposal(proposalId);
};
