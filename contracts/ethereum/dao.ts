
import { ethers } from 'ethers';

import type { HardhatRuntimeEnvironment } from 'hardhat/types';

const TEN_DAYS_PLUS_1 = 864000 + 1;

const ELEVEN_DAYS_PLUS_1 = TEN_DAYS_PLUS_1 + 950400;

export const PROPOSAL_STATUS_UNFINISHED = 0;

export const PROPOSAL_STATUS_FROZEN = 1;

export const PROPOSAL_STATUS_SUCCEEDED = 2;

export const PROPOSAL_STATUS_EXECUTED = 3;

export const PROPOSAL_STATUS_FAILED = 4;

export const advanceTimeToFrozen = async (
  hre: HardhatRuntimeEnvironment
) =>
  await hre.network.provider.send(
    "evm_increaseTime",
    [ TEN_DAYS_PLUS_1 ]
  );

export const advanceTimePastProposalFinished = async (
  hre: HardhatRuntimeEnvironment
) =>
  await hre.network.provider.send(
    "evm_increaseTime",
    [ ELEVEN_DAYS_PLUS_1 ]
  );

export const executeCalldataOnDAOVoteAllAndAdvanceTime = async (
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

  await advanceTimePastProposalFinished(hre);

  await dao.executeProposal(proposalId);
};
