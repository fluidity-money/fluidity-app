require("dotenv").config();

import type { Idl } from "@project-serum/anchor";

import { Connection } from "@solana/web3.js";
import {
  Program,
  Provider as Web3Provider,
  Wallet,
  web3,
} from "@project-serum/anchor";
import { PublicKey } from "@saberhq/solana-contrib";
import { base58_to_binary } from "base58-js";

import tribecaDataStoreIdl from "./idl/tribeca_data_store.json";

const SECRET_KEY = process.env.FLU_TRIBECA_DATA_STORE_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("FLU_TRIBECA_DATA_STORE_SECRET_KEY not provided");
}

const PROGRAM_ID = process.env.FLU_TRIBECA_DATA_STORE_PUBKEY;

if (!PROGRAM_ID) {
  throw new Error("FLU_TRIBECA_DATA_STORE_PUBKEY not provided");
}

const FLU_SOLANA_RPC_URL = process.env.FLU_SOLANA_RPC_URL;

if (!FLU_SOLANA_RPC_URL) {
  throw new Error("FLU_SOLANA_RPC_URL not provided");
}

// initialize keys
const payerKeypair = web3.Keypair.fromSecretKey(base58_to_binary(SECRET_KEY));

// initialize solana providers
const connection = new Connection(FLU_SOLANA_RPC_URL, "processed");

const wallet = new Wallet(payerKeypair);

// load tribeca-data-store program
const tribecaDataStoreProvider = new Web3Provider(
  connection,
  wallet,
  Web3Provider.defaultOptions(),
);

const program = new Program(
  tribecaDataStoreIdl as Idl,
  PROGRAM_ID,
  tribecaDataStoreProvider,
);

export const initializeHandler = async () => {
  const [calculateNArgsPda, calculateNArgsBump] = await PublicKey
    .findProgramAddress([Buffer.from("calculateNArgs")], program.programId);

  console.log(calculateNArgsPda.toString());

  console.log(program.instruction);

  const instruction = program.instruction.initialize(
    calculateNArgsBump,
    {
      accounts: {
        calculatenArgs: calculateNArgsPda,
        payer: payerKeypair.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
    },
  );

  return { instruction, signers: [payerKeypair] };
};

export const changeDeltaHandler = async () => {
  const newDelta_ = process.env.FLU_TRIBECA_DATA_STORE_DELTA;

  if (!newDelta_) {
    throw new Error("FLU_TRIBECA_DATA_STORE_DELTA not provided");
  }

  const newDelta = parseInt(newDelta_);

  const [calculateNArgsPda, calculateNArgsBump] = await PublicKey
    .findProgramAddress([Buffer.from("calculateNArgs")], program.programId);

  console.log(calculateNArgsPda.toString());

  console.log(program.instruction);

  const instruction = program.instruction.changeDelta(
    calculateNArgsBump,
    newDelta,
    {
      accounts: {
        calculatenArgs: calculateNArgsPda,
        authority: payerKeypair.publicKey,
      },
    },
  );

  return { instruction, signers: [payerKeypair] };
};

export const changePayoutFrequencyHandler = async () => {
  const newFreq_ = process.env.FLU_TRIBECA_DATA_STORE_FREQ;

  if (!newFreq_) {
    throw new Error("FLU_TRIBECA_DATA_STORE_FREQ not provided");
  }

  const newFreq = parseInt(newFreq_);

  const [calculateNArgsPda, calculateNArgsBump] = await PublicKey
    .findProgramAddress([Buffer.from("calculateNArgs")], program.programId);

  console.log(calculateNArgsPda.toString());

  console.log(program.instruction);

  const instruction = program.instruction.changeDelta(
    calculateNArgsBump,
    newFreq,
    {
      accounts: {
        calculatenArgs: calculateNArgsPda,
        authority: payerKeypair.publicKey,
      },
    },
  );

  return { instruction, signers: [payerKeypair] };
};
export const changeNumRewardTiersHandler = async () => {
  const newRewardTiers_ = process.env.FLU_TRIBECA_DATA_STORE_REWARD_TIERS;

  if (!newRewardTiers_) {
    throw new Error("FLU_TRIBECA_DATA_STORE_REWARD_TIERS not provided");
  }

  const newRewardTiers = parseInt(newRewardTiers_);

  const [calculateNArgsPda, calculateNArgsBump] = await PublicKey
    .findProgramAddress([Buffer.from("calculateNArgs")], program.programId);

  console.log(calculateNArgsPda.toString());

  console.log(program.instruction);

  const instruction = program.instruction.changeDelta(
    calculateNArgsBump,
    newRewardTiers,
    {
      accounts: {
        calculatenArgs: calculateNArgsPda,
        authority: payerKeypair.publicKey,
      },
    },
  );

  return { instruction, signers: [payerKeypair] };
};
