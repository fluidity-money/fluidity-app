import type {Idl, Program} from "@project-serum/anchor";

import * as Sentry from '@sentry/node';
import "@sentry/tracing";

import { newProgramMap } from "@saberhq/anchor-contrib";
import {Connection} from "@solana/web3.js";
import {Wallet, web3} from "@project-serum/anchor";
import {PublicKey, SolanaProvider, SolanaAugmentedProvider} from "@saberhq/solana-contrib";
import * as b58 from 'base58-js';

import UtilityGaugeIdl_ from './idls/utility_gauge.json';

const WORKER_ID = process.env.FLU_WORKER_ID as string;

if (!WORKER_ID) {
  throw new Error("WORKER_ID not provided");
};

const FLU_SENTRY_URL = process.env.FLU_SENTRY_URL as string;

if (FLU_SENTRY_URL) {
  Sentry.init({
    dsn: FLU_SENTRY_URL,
  });

  Sentry.configureScope(scope => {
    scope.setTag('worker-id', WORKER_ID);
  })
} 

const reportError = Sentry.getCurrentHub().getClient() ? 
  (e: any) => {throw e} :
  (e: any) => Sentry.captureException(e);

try {
const SOLANA_RPC_URL = process.env.FLU_SOLANA_RPC_URL as string;

if (!SOLANA_RPC_URL) {
  throw new Error("FLU_SOLANA_RPC_URL not provided");
}

const UTILITY_GAUGE_PROGRAM_ID = process.env.FLU_SOLANA_UTILITY_GAUGE_PROGRAM_ID as string;

if (!UTILITY_GAUGE_PROGRAM_ID) {
  throw new Error("FLU_SOLANA_UTILITY_GAUGE_PROGRAM_ID not provided");
}

const GAUGEMEISTER_PUBKEY = process.env.FLU_SOLANA_GAUGEMEISTER_PUBKEY as string;

if (!GAUGEMEISTER_PUBKEY) {
  throw new Error("FLU_SOLANA_GAUGEMEISTER_PUBKEY not provided");
}

const UTILITY_GAUGE_SECRET_KEY = process.env.FLU_SOLANA_UTILITY_GAUGE_SECRET_KEY as string;

if (!UTILITY_GAUGE_SECRET_KEY) {
  throw new Error("FLU_SOLANA_UTILITY_GAUGE_SECRET_KEY not provided");
}

const gaugemeisterPubkey = new PublicKey(GAUGEMEISTER_PUBKEY);

const utilityGaugePubkey = new PublicKey(UTILITY_GAUGE_PROGRAM_ID);

const payerKeypair = web3.Keypair.fromSecretKey(
  b58.base58_to_binary(UTILITY_GAUGE_SECRET_KEY)
);

const connection = new Connection(SOLANA_RPC_URL, "processed");

const wallet = new Wallet(payerKeypair);

const provider = SolanaProvider.init({
  connection,
  wallet,
});

const augmentedProvider = new SolanaAugmentedProvider(provider);

const UtilityGaugeIdl = UtilityGaugeIdl_ as Idl

type UtilityGaugeProgram = Program<typeof UtilityGaugeIdl>;

interface Programs {
  UtilityGauge: UtilityGaugeProgram;
}

const UTILITY_GAUGE_ADDRESSES = {
  UtilityGauge: utilityGaugePubkey,
};

const UTILITY_GAUGE_IDLS = {
  UtilityGauge: UtilityGaugeIdl,
};

const programs = newProgramMap<Programs>(
  provider,
  UTILITY_GAUGE_IDLS,
  UTILITY_GAUGE_ADDRESSES
);

const utilityGauge = programs.UtilityGauge;

const triggerNextEpoch = async(timeoutMs: number) => {
  setTimeout(async() => {
    const triggerNextEpochInst = utilityGauge.instruction.triggerNextEpoch({
      accounts: {
        gaugemeister: gaugemeisterPubkey,
      }
    });
  
    const triggerNextEpochTx = augmentedProvider.newTX([triggerNextEpochInst]);
  
    triggerNextEpochTx.addSigners(payerKeypair);
  
    await triggerNextEpochTx.send();
    
    const gaugemeister = await utilityGauge.account.gaugemeister.fetchNullable(gaugemeisterPubkey);
    
    if (gaugemeister === null) {
      throw new Error("could not fetch gaugemeister at address: " + gaugemeisterPubkey.toString());
    }

    const { epochDurationSeconds } = gaugemeister;
    
    timeoutMs = (epochDurationSeconds + 10) * 1000;

    await triggerNextEpoch(timeoutMs);

  }, timeoutMs);
}

(async() => {
  const gaugemeister = await utilityGauge.account.gaugemeister.fetchNullable(gaugemeisterPubkey);
  
  if (gaugemeister === null) {
    throw new Error("could not fetch gaugemeister at address: " + gaugemeisterPubkey.toString());
  }
  
  const { nextEpochStartsAt } = gaugemeister;
  const nextEpochStartsAtMs = nextEpochStartsAt.toNumber() * 1000;
  
  const currentUnixMs = (new Date()).valueOf()
  
  await triggerNextEpoch(nextEpochStartsAtMs - currentUnixMs + 10);

})();

} catch (e) {
  reportError(e);
}


