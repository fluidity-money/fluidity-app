require('dotenv').config()
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

import trfDataStoreIdl from "./idl/trf_data_store.json";

const SECRET_KEY = process.env.FLU_TRF_DATA_STORE_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("FLU_TRF_DATA_STORE_SECRET_KEY not provided");
}

const PROGRAM_ID = process.env.FLU_TRF_DATA_STORE_PROGRAM_ID;

if (!PROGRAM_ID) {
  throw new Error("FLU_TRF_DATA_STORE_PROGRAM_ID not provided");
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

// load trf-data-store program
const trfDataStoreProvider = new Web3Provider(
  connection,
  wallet,
  Web3Provider.defaultOptions(),
);

const program = new Program(
  trfDataStoreIdl as Idl,
  PROGRAM_ID,
  trfDataStoreProvider,
);

export const initializeHandler = async () => {
  const [trfDataStorePda, trfDataStoreBump] = await PublicKey
    .findProgramAddress([Buffer.from("trfDataStore")], program.programId);

  console.log(`Initializing data store acc at ${trfDataStorePda.toString()}`);

  const instruction = program.instruction.initialize(
    trfDataStoreBump,
    {
      accounts: {
        trfVars: trfDataStorePda,
        payer: payerKeypair.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
    },
  );

  return { instruction, signers: [payerKeypair] };
};

export const changeDeltaHandler = async () => {
  const newDeltaNum_ = process.env.FLU_TRF_DATA_STORE_DELTA_NUM;

  if (!newDeltaNum_) {
    throw new Error("FLU_TRF_DATA_STORE_DELTA_NUM not provided");
  }

  const newDeltaDenom_ = process.env.FLU_TRF_DATA_STORE_DELTA_DENOM;

  if (!newDeltaDenom_) {
    throw new Error("FLU_TRF_DATA_STORE_DELTA_DENOM not provided");
  }

  const newDeltaNum = parseInt(newDeltaNum_);

  if (isNaN(newDeltaNum)) {
    throw new Error("FLU_TRF_DATA_STORE_DELTA_NUM is NaN");
  }

  const newDeltaDenom = parseInt(newDeltaDenom_);

  if (isNaN(newDeltaDenom)) {
    throw new Error("FLU_TRF_DATA_STORE_DELTA_DENOM is NaN");
  }

  const [trfDataStorePda, trfDataStoreBump] = await PublicKey
    .findProgramAddress([Buffer.from("trfDataStore")], program.programId);

  console.log(`Changing ${trfDataStorePda.toString()} Delta to ${newDeltaNum}/${newDeltaDenom}`);

  const instruction = program.instruction.changeDelta(
    trfDataStoreBump,
    newDeltaNum,
    newDeltaDenom,
    {
      accounts: {
        trfVars: trfDataStorePda,
        authority: payerKeypair.publicKey,
      },
    },
  );

  return { instruction, signers: [payerKeypair] };
};

export const changePayoutFrequencyHandler = async () => {
  const newFreqNum_ = process.env.FLU_TRF_DATA_STORE_FREQ_NUM;

  if (!newFreqNum_) {
    throw new Error("FLU_TRF_DATA_STORE_FREQ_NUM not provided");
  }

  const newFreqDenom_ = process.env.FLU_TRF_DATA_STORE_FREQ_DENOM;

  if (!newFreqDenom_) {
    throw new Error("FLU_TRF_DATA_STORE_FREQ_DENOM not provided");
  }

  const newFreqNum = parseInt(newFreqNum_);

  if (isNaN(newFreqNum)) {
    throw new Error("FLU_TRF_DATA_STORE_FREQ_NUM is NaN");
  }

  const newFreqDenom = parseInt(newFreqDenom_);

  if (isNaN(newFreqDenom)) {
    throw new Error("FLU_TRF_DATA_STORE_FREQ_DENOM is NaN");
  }

  const [trfDataStorePda, trfDataStoreBump] = await PublicKey
    .findProgramAddress([Buffer.from("trfDataStore")], program.programId);

  console.log(
    `Changing ${trfDataStorePda.toString()} RewardFrequency to ${newFreqNum}/${newFreqDenom}`,
  );

  const instruction = program.instruction.changePayoutFrequency(
    trfDataStoreBump,
    newFreqNum,
    newFreqDenom,
    {
      accounts: {
        trfVars: trfDataStorePda,
        authority: payerKeypair.publicKey,
      },
    },
  );

  return { instruction, signers: [payerKeypair] };
};
export const changeNumRewardTiersHandler = async () => {
  const newRewardTiers_ = process.env.FLU_TRF_DATA_STORE_REWARD_TIERS;

  if (!newRewardTiers_) {
    throw new Error("FLU_TRF_DATA_STORE_REWARD_TIERS not provided");
  }

  const newRewardTiers = parseInt(newRewardTiers_);

  const [trfDataStorePda, trfDataStoreBump] = await PublicKey
    .findProgramAddress([Buffer.from("trfDataStore")], program.programId);

  console.log(
    `Changing ${trfDataStorePda.toString()} RewardTiers to ${newRewardTiers}`,
  );

  const instruction = program.instruction.changeNumRewardTiers(
    trfDataStoreBump,
    newRewardTiers,
    {
      accounts: {
        trfVars: trfDataStorePda,
        authority: payerKeypair.publicKey,
      },
    },
  );

  return { instruction, signers: [payerKeypair] };
};
