require("dotenv").config();

import type { Idl } from "@project-serum/anchor";

import { Connection } from "@solana/web3.js";
import {
  Program,
  Provider as Web3Provider,
  Wallet,
  web3,
} from "@project-serum/anchor";
import { PublicKey, SolanaProvider } from "@saberhq/solana-contrib";

import { GovernorWrapper, TribecaSDK } from "tribeca";

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY not provided");
}

const FLU_TRIBECA_GOVERNOR_PUBKEY = process.env.FLU_TRIBECA_GOVERNOR_PUBKEY;

if (!FLU_TRIBECA_GOVERNOR_PUBKEY) {
  throw new Error("FLU_TRIBECA_GOVERNOR_PUBKEY not provided");
}

const PROGRAM_ID = process.env.FLU_TRIBECA_DATA_STORE;

if (!PROGRAM_ID) {
  throw new Error("PROGRAM_ID not provided");
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
// initialize keys
const payerKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(SECRET_KEY));

console.log(payerKeypair.publicKey.toString());
console.log(payerKeypair.secretKey.toString());

const governorPubkey = new PublicKey(FLU_TRIBECA_GOVERNOR_PUBKEY);

// initialize solana providers
const connection = new Connection(FLU_SOLANA_RPC_URL, "processed");

const wallet = new Wallet(payerKeypair);

// load tribeca program
const tribecaProvider = SolanaProvider.init({
  connection,
  wallet,
});

const tribecaSdk = TribecaSDK.load({ provider: tribecaProvider });

const createProposalWithInstruction = async (
  instruction: web3.TransactionInstruction,
) => {
  const governor = new GovernorWrapper(tribecaSdk, governorPubkey);

  const { proposal, tx } = await governor.createProposal({
    proposer: payerKeypair.publicKey,
    instructions: [instruction],
  });

  tx.addSigners(payerKeypair);

  await tx.confirm();

  const txEnv = await governor.createProposalMeta({
    proposal: proposal,
    title: FLU_TRIBECA_PROPOSAL_TITLE,
    descriptionLink: FLU_TRIBECA_PROPOSAL_DESC,
  });

  txEnv.addSigners(payerKeypair);

  txEnv.send();
};

(async () => {
  switch (FLU_INSTRUCTION) {
    case "DRAIN_INSTRUCTION": {
      const { drainInstructionHandler } = await require(
        "./create-flu-solana-instruction",
      );
      const instruction = await drainInstructionHandler();
      await createProposalWithInstruction(instruction);
      return;
    }

    case "INITIALIZE_DATA_STORE": {
      const { initializeHandler } = await require(
        "./create-tribeca-data-store-instruction",
      );
      const instruction = await initializeHandler();
      return;
    }

    case "CHANGE_DELTA": {
      const { changeDeltaHandler } = await require(
        "./create-tribeca-data-store-instruction",
      );
      const instruction = await changeDeltaHandler();
      await createProposalWithInstruction(instruction);
      return;
    }

    case "CHANGE_PAYOUT_FREQ": {
      const { changePayoutFrequencyHandler } = await require(
        "./create-tribeca-data-store-instruction",
      );
      const instruction = await changePayoutFrequencyHandler();
      await createProposalWithInstruction(instruction);
      return;
    }

    case "CHANGE_NUM_REWARD_TIERS": {
      const { changeNumRewardTiersHandler } = await require(
        "./create-tribeca-data-store-instruction",
      );
      const instruction = await changeNumRewardTiersHandler();
      await createProposalWithInstruction(instruction);
      return;
    }

    default:
      throw new Error("Could not parse FLU_INSTRUCTION");
  }
})();
