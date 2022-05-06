require('dotenv').config();

import type { Idl } from "@project-serum/anchor";

import { Connection } from "@solana/web3.js";
import {
  Program,
  Provider as Web3Provider,
  Wallet,
  web3,
} from "@project-serum/anchor";
import { PublicKey } from "@saberhq/solana-contrib";

import tribecaDataStoreIdl from "./tribeca_data_store.json";

const SECRET_KEY = require(process.env.SECRET_KEY);

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

// initialize keys
const payerKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(SECRET_KEY));

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
  const bump_ = process.env.FLU_TRIBECA_DATA_STORE_BUMP || ;

  if (!bump_) {
    throw new Error("FLU_TRIBECA_DATA_STORE_BUMP not provided");
  }

  const bump = parseInt(bump_);

  const [calculateNArgsPda, calculateNArgsBump] = await PublicKey
    .findProgramAddress([Buffer.from("calculateNArgs")], program.programId);

  console.log(calculateNArgsPda.toString());

  console.log(program.instruction);

  const instruction = program.instruction.initialize(
    calculateNArgsBump,
    bump,
    {
      accounts: {
        calculatenArgs: calculateNArgsPda,
        payer,
        systemProgram: web3.SystemProgram.programId,
      },
    },
  );

  return instruction;
};

export const changeDeltaHandler = async (newDelta: number) => {
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
        systemProgram: web3.SystemProgram.programId,
      },
    },
  );

  return instruction;
};

export const changePayoutFrequencyHandler = async (newFreq: number) => {
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
        systemProgram: web3.SystemProgram.programId,
      },
    },
  );

  return instruction;
};
export const changeNumRewardTiersHandler = async (newRewardTiers: number) => {
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
        systemProgram: web3.SystemProgram.programId,
      },
    },
  );

  return instruction;
};
