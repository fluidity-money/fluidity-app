require("dotenv").config();

import { Connection } from "@solana/web3.js";
import { Wallet, web3 } from "@project-serum/anchor";
import { PublicKey, SolanaProvider } from "@saberhq/solana-contrib";

import { GovernorWrapper, TribecaSDK } from "tribeca/dist/cjs";

const FLU_TRIBECA_GOVERNOR_PUBKEY = process.env.FLU_TRIBECA_GOVERNOR_PUBKEY;

if (!FLU_TRIBECA_GOVERNOR_PUBKEY) {
  throw new Error("FLU_TRIBECA_GOVERNOR_PUBKEY not provided");
}

const FLU_SOLANA_RPC_URL = process.env.FLU_SOLANA_RPC_URL;

if (!FLU_SOLANA_RPC_URL) {
  throw new Error("SOLANA_RPC not provided");
}

const FLU_TRIBECA_PROPOSAL_TITLE = process.env.FLU_TRIBECA_PROPOSAL_TITLE;

if (!FLU_TRIBECA_PROPOSAL_TITLE) {
  throw new Error("FLU_TRIBECA_PROPOSAL_TITLE not provided");
}

const FLU_TRIBECA_PROPOSAL_DESC = process.env.FLU_TRIBECA_PROPOSAL_DESC;

if (!FLU_TRIBECA_PROPOSAL_DESC) {
  throw new Error("FLU_TRIBECA_PROPOSAL_DESC not provided");
}

const FLU_INSTRUCTION = process.env.FLU_INSTRUCTION;

if (!FLU_INSTRUCTION) {
  throw new Error("FLU_INSTRUCTION not provided");
}

const governorPubkey = new PublicKey(FLU_TRIBECA_GOVERNOR_PUBKEY);

const createProposalWithInstruction = async (
  instruction: web3.TransactionInstruction,
  signers: web3.Keypair[] = [],
) => {
  if (!signers.length) {
    throw new Error("No signers found");
  }

  console.log(`Defaulting proposer to first signer! ${signers[0].publicKey}`);

  // initialize solana providers
  const connection = new Connection(FLU_SOLANA_RPC_URL, "processed");

  const wallet = new Wallet(signers[0]);

  // load tribeca program
  const tribecaProvider = SolanaProvider.init({
    connection,
    wallet,
  });

  const tribecaSdk = TribecaSDK.load({ provider: tribecaProvider });

  const governor = new GovernorWrapper(tribecaSdk, governorPubkey);

  const { proposal, tx } = await governor.createProposal({
    proposer: signers[0].publicKey,
    instructions: [instruction],
  });

  tx.addSigners(...signers);

  await tx.confirm();

  const txEnv = await governor.createProposalMeta({
    proposal: proposal,
    title: FLU_TRIBECA_PROPOSAL_TITLE,
    descriptionLink: FLU_TRIBECA_PROPOSAL_DESC,
  });

  txEnv.addSigners(...signers);

  txEnv.send();
};

(async () => {
  switch (FLU_INSTRUCTION) {
    case "DRAIN_INSTRUCTION": {
      const { drainInstructionHandler } = await require(
        "./create-flu-solana-instruction",
      );
      const { instruction, signers } = await drainInstructionHandler();
      await createProposalWithInstruction(instruction, signers);
      return;
    }

    case "INITIALIZE_DATA_STORE": {
      const { initializeHandler } = await require(
        "./create-tribeca-data-store-instruction",
      );
      const { instruction, signers } = await initializeHandler();
      await createProposalWithInstruction(instruction, signers);
      return;
    }

    case "CHANGE_DELTA": {
      const { changeDeltaHandler } = await require(
        "./create-tribeca-data-store-instruction",
      );
      const { instruction, signers } = await changeDeltaHandler();
      await createProposalWithInstruction(instruction, signers);
      return;
    }

    case "CHANGE_PAYOUT_FREQ": {
      const { changePayoutFrequencyHandler } = await require(
        "./create-tribeca-data-store-instruction",
      );
      const { instruction, signers } = await changePayoutFrequencyHandler();
      await createProposalWithInstruction(instruction, signers);
      return;
    }

    case "CHANGE_NUM_REWARD_TIERS": {
      const { changeNumRewardTiersHandler } = await require(
        "./create-tribeca-data-store-instruction",
      );
      const { instruction, signers } = await changeNumRewardTiersHandler();
      await createProposalWithInstruction(instruction, signers);
      return;
    }

    default:
      throw new Error("Could not parse FLU_INSTRUCTION");
  }
})();
