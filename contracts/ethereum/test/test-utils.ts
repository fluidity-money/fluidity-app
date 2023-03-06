
import * as ethers from 'ethers';

import { assert } from 'chai';

import type { HardhatRuntimeEnvironment } from 'hardhat';

import { EMPTY_ADDRESS } from '../script-utils';

export const expectEq = (a: ethers.BigNumberish, b: ethers.BigNumberish) => {
    const aBN = ethers.BigNumber.from(a);
    const bBN = ethers.BigNumber.from(b);
    assert(aBN.eq(bBN), `${aBN.toString()} != ${bBN.toString()}`);
};

export const expectGt = (a: ethers.BigNumberish, b: ethers.BigNumberish) => {
    const aBN = ethers.BigNumber.from(a);
    const bBN = ethers.BigNumber.from(b);
    assert(aBN.gt(bBN), `!(${aBN.toString()} > ${bBN.toString()})`);
};

export const sendEmptyTransaction = async (signer: ethers.Signer): Promise<void> => {
  await signer.sendTransaction({
    from: await signer.getAddress(),
    to: EMPTY_ADDRESS
  });
};

export const callAndSendProposal = async (
  dao: ethers.Contract,
  proposalHash: string,
  target: string,
  voteForBalance: number,
  voteAgainstBalance: number,
  shouldDelegateCall: boolean,
  calldata: string
): Promise<string> => {
  const args = [
    proposalHash,
    target,
    voteForBalance,
    voteAgainstBalance,
    shouldDelegateCall,
    calldata
  ];

  const proposalId =
    await dao.callStatic.createProposal.apply(
      null,
      args
    );

  await dao.createProposal.apply(null, args);

  return proposalId;
};

export const callAndExecuteProposal = async (
  dao: ethers.Contract,
  proposalId: string
): Promise<string> => {
  const bytes = await dao.callStatic.executeProposal(proposalId);
  await dao.executeProposal(proposalId);
  return bytes;
};

export const advanceTime = async (
  hre: HardhatRuntimeEnvironment,
  seconds: number
) =>
  await hre.network.provider.send(
    "evm_increaseTime",
    [ seconds ]
  );
